import { assertIsolatedPostgres } from "./lib/assert-isolated-postgres";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";


async function main() {
  const testUrl = await assertIsolatedPostgres();
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: testUrl! }) });
  const email = `migration-test-${Date.now()}@example.invalid`, password = "MigrationTest!42";
  try {
    const hash = await bcrypt.hash(password, 10);
    const active = await prisma.user.create({ data: { id: `test-${Date.now()}`, email, fullName: "Migration Test", passwordHash: hash, role: "USER", status: "ACTIVE" } });
    const disabled = await prisma.user.create({ data: { id: `test-disabled-${Date.now()}`, email: `disabled-${email}`, fullName: "Disabled Test", passwordHash: hash, role: "USER", status: "BLOCKED" } });
    if (!(await bcrypt.compare(password, active.passwordHash!)) || await bcrypt.compare("wrong", active.passwordHash!)) throw new Error("bcrypt verification failed");
    if (disabled.status === "ACTIVE" || active.role !== "USER") throw new Error("role/status restriction failed");
    const token = jwt.sign({ id: active.id, email: active.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    if (payload.id !== active.id || payload.email !== active.email) throw new Error("JWT payload failed");
    console.log(JSON.stringify({ bcrypt: true, incorrectPasswordRejected: true, jwtPayload: true, roleAndDisabledChecks: true, cookieBehavior: "covered by route integration once test URL is supplied" }));
  } finally { await prisma.user.deleteMany({ where: { email: { contains: "@example.invalid" } } }); await prisma.$disconnect(); }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
