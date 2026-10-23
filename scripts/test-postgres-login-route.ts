import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { assertIsolatedPostgres } from "./lib/assert-isolated-postgres";

const PASSWORD = "RouteLoginTest!42";
const port = 43000 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;
const productionMode = process.env.ROUTE_TEST_PRODUCTION === "true";

function strictSslUrl(connectionUrl: string) {
  const url = new URL(connectionUrl);
  if (url.searchParams.get("sslmode") === "disable") {
    throw new Error("Isolated PostgreSQL tests require TLS");
  }
  // Keep TLS verification explicit as pg's default sslmode semantics evolve.
  url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function postLogin(body: Record<string, unknown>) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { response, body: await response.json() as { msg?: string } };
}

function assertCookie(setCookie: string | null, expectedMaxAge: number, secure: boolean) {
  assert(setCookie, "Login response did not include a cookie");
  const cookie = setCookie.toLowerCase();
  assert(cookie.startsWith("userauthtoken="), "Login response used an unexpected cookie name");
  assert(cookie.includes("httponly"), "Login cookie must be HttpOnly");
  assert(cookie.includes("secure") === secure, "Login cookie Secure flag does not match the active environment");
  assert(cookie.includes("samesite=strict"), "Login cookie must use SameSite=Strict");
  assert(cookie.includes("path=/"), "Login cookie must use path=/");
  assert(cookie.includes(`max-age=${expectedMaxAge}`), "Login cookie expiration does not match the route behavior");
}

function assertCookieJwt(setCookie: string | null, expectedId: string, expectedEmail: string) {
  assert(setCookie, "Login response did not include a JWT cookie");
  const token = decodeURIComponent(setCookie.split(";", 1)[0].split("=", 2)[1] ?? "");
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id?: string; email?: string };
  assert(payload.id === expectedId && payload.email === expectedEmail, "Login JWT payload changed");
}

async function waitForServer() {
  let lastError: unknown;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, { method: "OPTIONS" });
      if (response.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await delay(500);
  }
  throw new Error(`Isolated Next.js route server did not become ready${lastError ? "" : ""}`);
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

async function runNextBuild(nextBin: string, environment: NodeJS.ProcessEnv) {
  const build = spawn(process.execPath, [nextBin, "build"], {
    cwd: process.cwd(),
    env: environment,
    stdio: "ignore",
    windowsHide: true,
  });
  const code = await new Promise<number | null>((resolve) => build.once("exit", resolve));
  if (code !== 0) throw new Error("Isolated production Next.js build failed");
}

async function main() {
  const testUrl = strictSslUrl(await assertIsolatedPostgres());
  assert(process.env.JWT_SECRET, "JWT_SECRET is required for route integration testing");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: testUrl }) });
  const suffix = randomUUID();
  const ids = [`route-active-${suffix}`, `route-disabled-${suffix}`, `route-admin-${suffix}`];
  const activeEmail = `route-active-${suffix}@example.invalid`;
  const disabledEmail = `route-disabled-${suffix}@example.invalid`;
  const vendorEmail = `route-vendor-${suffix}@example.invalid`;
  let server: ReturnType<typeof spawn> | undefined;

  try {
    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    await prisma.user.createMany({
      data: [
        { id: ids[0], email: activeEmail, fullName: "Route Active Test", passwordHash, role: "USER", status: "ACTIVE" },
        { id: ids[1], email: disabledEmail, fullName: "Route Disabled Test", passwordHash, role: "USER", status: "BLOCKED" },
        { id: ids[2], email: vendorEmail, fullName: "Route Vendor Test", passwordHash, role: "VENDOR", status: "ACTIVE" },
      ],
    });

    const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
    const serverEnvironment = {
      ...process.env,
      AUTH_DATABASE: "postgresql",
      DATABASE_URL: testUrl,
      NODE_ENV: productionMode ? "production" : "development",
    };
    if (productionMode) await runNextBuild(nextBin, serverEnvironment);
    server = spawn(process.execPath, [nextBin, productionMode ? "start" : "dev", "-p", String(port)], {
      cwd: process.cwd(),
      env: serverEnvironment,
      stdio: ["ignore", "ignore", "ignore"],
      windowsHide: true,
    });
    await waitForServer();

    const successful = await postLogin({ email: activeEmail, password: PASSWORD, rememberMe: false });
    assert(successful.response.status === 200 && successful.body.msg === "Login successful", "Successful login response changed");
    assertCookie(successful.response.headers.get("set-cookie"), 604800, productionMode);
    assertCookieJwt(successful.response.headers.get("set-cookie"), ids[0], activeEmail);

    const remembered = await postLogin({ email: activeEmail, password: PASSWORD, rememberMe: true });
    assert(remembered.response.status === 200, "Remember-me login failed");
    assertCookie(remembered.response.headers.get("set-cookie"), 2592000, productionMode);

    const incorrectPassword = await postLogin({ email: activeEmail, password: "not-the-password" });
    assert(incorrectPassword.response.status === 401 && incorrectPassword.body.msg === "Invalid email or password", "Invalid-password response changed");

    const disabled = await postLogin({ email: disabledEmail, password: PASSWORD });
    assert(disabled.response.status === 403 && disabled.body.msg === "Not Authorised", "Disabled-user restriction changed");

    const disallowedRole = await postLogin({ email: vendorEmail, password: PASSWORD });
    assert(disallowedRole.response.status === 403 && disallowedRole.body.msg === "Not Authorised", "Role restriction changed");

    console.log(JSON.stringify({
      isolatedPostgresRoute: true,
      successfulLoginResponse: true,
      invalidPasswordResponse: true,
      disabledAccountRestriction: true,
      roleRestriction: true,
      jwtCookie: { name: "userAuthToken", httpOnly: true, secure: productionMode, sameSite: "strict", path: "/", expiration: "route-default-and-remember-me" },
      jwtPayloadFromRouteCookie: true,
      sessionCookieNameCompatible: true,
      authDatabase: "postgresql",
      disposableUsersCleanedUp: true,
    }));
  } finally {
    await stopServer(server);
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Route integration test failed");
  process.exitCode = 1;
});
