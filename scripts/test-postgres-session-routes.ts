import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { assertIsolatedPostgres } from "./lib/assert-isolated-postgres";

const port = 44000 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function strictSslUrl(connectionUrl: string) {
  const url = new URL(connectionUrl);
  if (url.searchParams.get("sslmode") === "disable") throw new Error("Isolated PostgreSQL tests require TLS");
  url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}

async function getSession(route: string, token?: string) {
  const response = await fetch(`${baseUrl}${route}`, {
    headers: token ? { cookie: `userAuthToken=${encodeURIComponent(token)}` } : {},
  });
  return { response, body: await response.json() as { _id?: string; email?: string; msg?: string; error?: string } };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/userAuthTokenCookies`);
      if (response.status < 500) return;
    } catch {
      // The local server has not started yet.
    }
    await delay(500);
  }
  throw new Error("Isolated Next.js session route server did not become ready");
}

async function stopServer(server: ReturnType<typeof spawn> | undefined) {
  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    new Promise<void>((resolve) => server.once("exit", () => resolve())),
    delay(10_000),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

async function main() {
  const testUrl = strictSslUrl(await assertIsolatedPostgres());
  assert(process.env.JWT_SECRET, "JWT_SECRET is required for session route integration testing");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: testUrl }) });
  const suffix = randomUUID();
  const ids = [`session-active-${suffix}`, `session-disabled-${suffix}`, `session-vendor-${suffix}`];
  const activeEmail = `session-active-${suffix}@example.invalid`;
  let server: ReturnType<typeof spawn> | undefined;

  try {
    const passwordHash = await bcrypt.hash("SessionRouteTest!42", 10);
    await prisma.user.createMany({
      data: [
        { id: ids[0], email: activeEmail, fullName: "Session Active Test", passwordHash, role: "USER", status: "ACTIVE" },
        { id: ids[1], email: `session-disabled-${suffix}@example.invalid`, fullName: "Session Disabled Test", passwordHash, role: "USER", status: "BLOCKED" },
        { id: ids[2], email: `session-vendor-${suffix}@example.invalid`, fullName: "Session Vendor Test", passwordHash, role: "VENDOR", status: "ACTIVE" },
      ],
    });

    const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
    server = spawn(process.execPath, [nextBin, "dev", "-p", String(port)], {
      cwd: process.cwd(),
      env: { ...process.env, AUTH_DATABASE: "postgresql", DATABASE_URL: testUrl, NODE_ENV: "development" },
      stdio: ["ignore", "ignore", "ignore"],
      windowsHide: true,
    });
    await waitForServer();

    const activeToken = jwt.sign({ id: ids[0], email: activeEmail }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const disabledToken = jwt.sign({ id: ids[1], email: `session-disabled-${suffix}@example.invalid` }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const vendorToken = jwt.sign({ id: ids[2], email: `session-vendor-${suffix}@example.invalid` }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const expiredToken = jwt.sign({ id: ids[0], email: activeEmail }, process.env.JWT_SECRET!, { expiresIn: -1 });

    for (const route of ["/api/auth/userAuthTokenCookies", "/api/users/userDetails/cookies"]) {
      const valid = await getSession(route, activeToken);
      assert(valid.response.status === 200 && valid.body._id === ids[0] && valid.body.email === activeEmail, `Valid session lookup failed for ${route}`);

      const missing = await getSession(route);
      assert(missing.response.status === 401, `Missing-cookie response changed for ${route}`);

      const expired = await getSession(route, expiredToken);
      assert(expired.response.status === 401 && expired.body.error === "Invalid token.", `Expired-token response changed for ${route}`);

      const disabled = await getSession(route, disabledToken);
      assert(disabled.response.status === 403 && disabled.body.error === "Not Authorised", `Disabled-account response changed for ${route}`);

      const vendor = await getSession(route, vendorToken);
      assert(vendor.response.status === 403 && vendor.body.error === "Not Authorised", `Role restriction changed for ${route}`);
    }

    console.log(JSON.stringify({
      isolatedPostgresSessionRoutes: true,
      validSessionLookup: true,
      missingCookieRejected: true,
      expiredJwtRejected: true,
      disabledAccountRejected: true,
      unauthorizedRoleRejected: true,
      postgresIdCompatibility: true,
      disposableUsersCleanedUp: true,
    }));
  } finally {
    await stopServer(server);
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Session route integration test failed");
  process.exitCode = 1;
});
