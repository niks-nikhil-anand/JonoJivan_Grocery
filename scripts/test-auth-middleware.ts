import jwt from "jsonwebtoken";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { NextRequest } from "next/server";

loadEnvConfig(path.resolve(process.cwd()), process.env.NODE_ENV !== "production");

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
async function middlewareFor(request: NextRequest) { return (await import("../src/middleware.js")).middleware(request); }
function request(path: string, cookie?: string) { return new NextRequest(`https://example.test${path}`, { headers: cookie ? { cookie } : {} }); }
function isRedirect(response: Response, target: string) { return response.status >= 300 && response.status < 400 && response.headers.get("location") === `https://example.test${target}`; }

async function main() {
  assert(process.env.JWT_SECRET, "JWT_SECRET is required");
  const validUser = jwt.sign({ id: "user-1", email: "user@example.invalid" }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  const expiredUser = jwt.sign({ id: "user-1", email: "user@example.invalid" }, process.env.JWT_SECRET!, { expiresIn: -1 });
  const validAdmin = jwt.sign({ id: "admin-1", email: "admin@example.invalid" }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  const validVendor = jwt.sign({ id: "vendor-1", email: "vendor@example.invalid" }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  assert(isRedirect(await middlewareFor(request("/users/user-1")), "/auth/signIn"), "Missing user cookie was not rejected");
  assert((await middlewareFor(request("/users/user-1", `userAuthToken=${validUser}`))).headers.get("x-middleware-next") === "1", "Valid user token was rejected");
  assert(isRedirect(await middlewareFor(request("/users/user-1", `userAuthToken=${expiredUser}`)), "/auth/signIn"), "Expired user token was accepted");
  assert(isRedirect(await middlewareFor(request("/admin/dashboard")), "/admin/auth"), "Missing admin cookie was not rejected");
  assert((await middlewareFor(request("/admin/dashboard", `adminAuthToken=${validAdmin}`))).headers.get("x-middleware-next") === "1", "Valid admin token was rejected");
  assert(isRedirect(await middlewareFor(request("/vendor/dashboard")), "/admin/auth"), "Missing vendor cookie was not rejected");
  assert((await middlewareFor(request("/vendor/dashboard", `vendorAuthToken=${validVendor}`))).headers.get("x-middleware-next") === "1", "Valid vendor token was rejected");
  console.log(JSON.stringify({ customJwtSignatureAndExpiryVerified: true, userMiddleware: true, adminMiddleware: true, vendorMiddleware: true }));
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "Middleware test failed"); process.exitCode = 1; });
