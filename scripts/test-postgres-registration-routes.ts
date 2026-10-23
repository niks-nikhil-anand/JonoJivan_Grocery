import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { assertIsolatedPostgres } from "./lib/assert-isolated-postgres";

const port = 46000 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function strictSslUrl(connectionUrl: string) { const url = new URL(connectionUrl); if (url.searchParams.get("sslmode") === "disable") throw new Error("Isolated PostgreSQL tests require TLS"); url.searchParams.set("sslmode", "verify-full"); return url.toString(); }
async function waitForServer() { for (let attempt = 0; attempt < 60; attempt += 1) { try { const response = await fetch(`${baseUrl}/api/auth/register`, { method: "OPTIONS" }); if (response.status < 500) return; } catch {} await delay(500); } throw new Error("Isolated registration route server did not become ready"); }
async function stopServer(server: ReturnType<typeof spawn> | undefined) { if (!server || server.exitCode !== null) return; server.kill("SIGTERM"); await Promise.race([new Promise<void>((resolve) => server.once("exit", () => resolve())), delay(10_000)]); if (server.exitCode === null) server.kill("SIGKILL"); }
async function postForm(route: string, fields: Record<string, string>) { const form = new FormData(); Object.entries(fields).forEach(([key, value]) => form.set(key, value)); const response = await fetch(`${baseUrl}${route}`, { method: "POST", body: form }); return { response, body: await response.json() as { msg?: string } }; }

async function main() {
  const testUrl = strictSslUrl(await assertIsolatedPostgres());
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: testUrl }) });
  const suffix = randomUUID();
  const userEmail = `register-${suffix}@example.invalid`;
  const vendorEmail = `vendor-register-${suffix}@example.invalid`;
  let server: ReturnType<typeof spawn> | undefined;
  try {
    const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
    server = spawn(process.execPath, [nextBin, "dev", "-p", String(port)], { cwd: process.cwd(), env: { ...process.env, AUTH_DATABASE: "postgresql", DATABASE_URL: testUrl, AUTH_TEST_SKIP_EMAIL: "true", NODE_ENV: "development" }, stdio: ["ignore", "ignore", "ignore"], windowsHide: true });
    await waitForServer();
    const user = await postForm("/api/auth/register", { fullName: "Registration Test", email: userEmail, mobileNumber: "9876543210", password: "RegisterRoute!42" });
    assert(user.response.status === 200 && user.body.msg === "Account created successfully", "PostgreSQL user registration failed");
    const storedUser = await prisma.user.findUnique({ where: { email: userEmail } });
    assert(storedUser?.role === "USER" && storedUser.status === "ACTIVE" && Boolean(storedUser.passwordHash) && await bcrypt.compare("RegisterRoute!42", storedUser.passwordHash), "Stored user fields changed");
    const duplicate = await postForm("/api/auth/register", { fullName: "Registration Test", email: userEmail, mobileNumber: "9876543210", password: "RegisterRoute!42" });
    assert(duplicate.response.status === 400, "Duplicate user was accepted");
    const vendor = await postForm("/api/auth/vendorRegistration", { fullName: "Vendor Registration Test", email: vendorEmail, mobileNumber: "9123456789", password: "VendorRoute!42", confirmPassword: "VendorRoute!42", businessName: "Test Business" });
    assert(vendor.response.status === 200 && vendor.body.msg === "Account created successfully", "PostgreSQL vendor registration failed");
    const storedVendor = await prisma.user.findUnique({ where: { email: vendorEmail }, include: { vendorProfile: true } });
    assert(storedVendor?.role === "VENDOR" && storedVendor.status === "ACTIVE" && storedVendor.vendorProfile?.status === "PENDING" && await bcrypt.compare("VendorRoute!42", storedVendor.passwordHash!), "Stored vendor fields changed");
    console.log(JSON.stringify({ isolatedPostgresRegistration: true, userRegistration: true, duplicateRejected: true, vendorRegistration: true, bcryptHashesVerified: true, disposableUsersCleanedUp: true }));
  } finally {
    await stopServer(server);
    await prisma.user.deleteMany({ where: { email: { in: [userEmail, vendorEmail] } } });
    await prisma.$disconnect();
  }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "Registration test failed"); process.exitCode = 1; });
