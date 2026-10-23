/*
 * Safe account migration. Default mode is dry-run; use APPLY=true explicitly.
 * Run with a TypeScript runner after reviewing reports, for example:
 *   APPLY=true npx tsx scripts/migrate-users-to-postgres.ts
 */
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, AccountStatus, UserRole } from "../src/generated/prisma/client";

// Match Next.js environment precedence: process env, .env.local, .env.
loadEnvConfig(path.resolve(process.cwd()), process.env.NODE_ENV !== "production");

const apply = process.env.APPLY === "true";
const report = { total: 0, valid: 0, plannedMigrations: 0, created: 0, existing: 0, duplicates: [] as string[], conflicts: [] as string[], failed: [] as string[] };
const statusMap: Record<string, AccountStatus> = { Blocked: "BLOCKED", Pending: "PENDING", inReview: "IN_REVIEW", Active: "ACTIVE" };
const roleMap: Record<string, UserRole> = { User: "USER", SuperAdmin: "SUPER_ADMIN", Vendor: "VENDOR" };

async function main() {
  if (!process.env.MONGODB_URI || !process.env.DATABASE_URL) throw new Error("MONGODB_URI and DATABASE_URL are required");
  await mongoose.connect(process.env.MONGODB_URI, { readPreference: "secondaryPreferred" });
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const users = await mongoose.connection.collection("users").find({}).toArray();
  const seenEmails = new Set<string>();
  report.total = users.length;
  for (const source of users) {
    const id = String(source._id), email = String(source.email || "").trim().toLowerCase();
    if (!email || !source.fullName) { report.failed.push(`${id}: missing email or fullName`); continue; }
    if (seenEmails.has(email)) { report.duplicates.push(`${id}: duplicate MongoDB email ${email}`); continue; }
    seenEmails.add(email);
    report.valid++;
    const [byId, byEmail] = await Promise.all([prisma.user.findUnique({ where: { id } }), prisma.user.findUnique({ where: { email } })]);
    if (byId && byEmail && byId.id === byEmail.id) { report.existing++; continue; }
    if (byId || byEmail) { report.conflicts.push(`${id}: conflicts with PostgreSQL user ${byId?.id || byEmail?.id}`); continue; }
    if (!apply) { report.plannedMigrations++; continue; }
    try { await prisma.user.create({ data: { id, email, fullName: String(source.fullName), mobileNumber: source.mobileNumber || null, passwordHash: source.password || null, isVerified: Boolean(source.isVerified), verificationExpiresAt: source.isVerifiedExpires || null, resetPasswordToken: source.resetPasswordToken || null, resetPasswordExpiresAt: source.resetPasswordExpires || null, profileImage: source.profilePic || null, role: roleMap[source.role] || "USER", status: statusMap[source.status] || "ACTIVE", createdAt: source.createdAt || new Date(), updatedAt: source.updatedAt || new Date() } }); report.created++; } catch (e) { report.failed.push(`${id}: ${e instanceof Error ? e.message : "unknown error"}`); }
  }
  console.log(JSON.stringify({ dryRun: !apply, ...report }, null, 2));
  await prisma.$disconnect(); await mongoose.disconnect();
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
