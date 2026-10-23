import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { assertIsolatedPostgres } from "./lib/assert-isolated-postgres";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function strictSslUrl(connectionUrl: string) { const url = new URL(connectionUrl); if (url.searchParams.get("sslmode") === "disable") throw new Error("Isolated PostgreSQL tests require TLS"); url.searchParams.set("sslmode", "verify-full"); return url.toString(); }

async function main() {
  const testUrl = strictSslUrl(await assertIsolatedPostgres());
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const originalAuthDatabase = process.env.AUTH_DATABASE;
  process.env.DATABASE_URL = testUrl;
  process.env.AUTH_DATABASE = "postgresql";
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: testUrl }) });
  const email = `oauth-${randomUUID()}@example.invalid`;
  try {
    const { findOrCreateOAuthUser } = await import("../src/lib/authAccount.js");
    const first = await findOrCreateOAuthUser({ name: "OAuth Test", email });
    const second = await findOrCreateOAuthUser({ name: "Changed Name", email });
    const users = await prisma.user.findMany({ where: { email } });
    assert(users.length === 1 && first.id === second.id && first.email === email, "OAuth account lookup/create was not idempotent");
    assert(users[0].role === "USER" && users[0].status === "ACTIVE", "OAuth account fields changed");
    console.log(JSON.stringify({ isolatedPostgresNextAuthAccount: true, createdOnce: true, existingAccountReused: true, postgresIdCompatible: true, disposableUserCleanedUp: true }));
  } finally {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
    process.env.DATABASE_URL = originalDatabaseUrl;
    process.env.AUTH_DATABASE = originalAuthDatabase;
  }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "NextAuth account test failed"); process.exitCode = 1; });
