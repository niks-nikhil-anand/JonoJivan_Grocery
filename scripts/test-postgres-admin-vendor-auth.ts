import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { assertIsolatedPostgres } from "./lib/assert-isolated-postgres";

const port = 45000 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;
const password = "AdminVendorRoute!42";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function strictSslUrl(connectionUrl: string) {
  const url = new URL(connectionUrl);
  if (url.searchParams.get("sslmode") === "disable") throw new Error("Isolated PostgreSQL tests require TLS");
  url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}

async function login(route: string, email: string, candidatePassword: string) {
  const response = await fetch(`${baseUrl}${route}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password: candidatePassword }) });
  return { response, body: await response.json() as { msg?: string } };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/admin/auth`, { method: "OPTIONS" });
      if (response.status < 500) return;
    } catch {}
    await delay(500);
  }
  throw new Error("Isolated authentication route server did not become ready");
}

async function stopServer(server: ReturnType<typeof spawn> | undefined) {
  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([new Promise<void>((resolve) => server.once("exit", () => resolve())), delay(10_000)]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

async function main() {
  const testUrl = strictSslUrl(await assertIsolatedPostgres());
  assert(process.env.JWT_SECRET, "JWT_SECRET is required");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: testUrl }) });
  const suffix = randomUUID();
  const ids = [`admin-${suffix}`, `vendor-${suffix}`, `blocked-${suffix}`];
  const adminEmail = `admin-${suffix}@example.invalid`;
  const vendorEmail = `vendor-${suffix}@example.invalid`;
  let server: ReturnType<typeof spawn> | undefined;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.createMany({ data: [
      { id: ids[0], fullName: "Admin Auth Test", email: adminEmail, passwordHash, role: "SUPER_ADMIN", status: "ACTIVE" },
      { id: ids[1], fullName: "Vendor Auth Test", email: vendorEmail, passwordHash, role: "VENDOR", status: "ACTIVE" },
      { id: ids[2], fullName: "Blocked Auth Test", email: `blocked-${suffix}@example.invalid`, passwordHash, role: "SUPER_ADMIN", status: "BLOCKED" },
    ] });
    const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
    server = spawn(process.execPath, [nextBin, "dev", "-p", String(port)], { cwd: process.cwd(), env: { ...process.env, AUTH_DATABASE: "postgresql", DATABASE_URL: testUrl, NODE_ENV: "development" }, stdio: ["ignore", "ignore", "ignore"], windowsHide: true });
    await waitForServer();

    const admin = await login("/api/admin/auth", adminEmail, password);
    assert(admin.response.status === 200 && admin.body.msg === "Login successful", "Admin PostgreSQL login failed");
    const adminCookie = admin.response.headers.get("set-cookie");
    assert(adminCookie?.startsWith("adminAuthToken=") && adminCookie.includes("HttpOnly") && adminCookie.includes("SameSite=strict"), "Admin cookie changed");
    const adminToken = adminCookie.split(";", 1)[0].split("=", 2)[1];
    assert((jwt.verify(adminToken, process.env.JWT_SECRET!) as { id?: string }).id === ids[0], "Admin JWT ID changed");

    const vendor = await login("/api/vendor/auth", vendorEmail, password);
    assert(vendor.response.status === 200 && vendor.body.msg === "Login successful", "Vendor PostgreSQL login failed");
    assert(vendor.response.headers.get("set-cookie")?.startsWith("vendorAuthToken="), "Vendor cookie changed");
    const wrongPassword = await login("/api/admin/auth", adminEmail, "wrong-password");
    assert(wrongPassword.response.status === 401 && wrongPassword.body.msg === "Invalid email or password", "Invalid-password response changed");
    const wrongRole = await login("/api/admin/auth", vendorEmail, password);
    assert(wrongRole.response.status === 403 && wrongRole.body.msg === "Not Authorised", "Role restriction changed");
    const blocked = await login("/api/admin/auth", `blocked-${suffix}@example.invalid`, password);
    assert(blocked.response.status === 403 && blocked.body.msg === "Not Authorised", "Blocked-account restriction changed");
    console.log(JSON.stringify({ isolatedPostgresAdminVendorAuth: true, adminLogin: true, vendorLogin: true, invalidPasswordRejected: true, roleAndDisabledRestrictions: true, jwtAndCookies: true, disposableUsersCleanedUp: true }));
  } finally {
    await stopServer(server);
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  }
}

main().catch((error) => { console.error(error instanceof Error ? error.message : "Admin/vendor auth test failed"); process.exitCode = 1; });
