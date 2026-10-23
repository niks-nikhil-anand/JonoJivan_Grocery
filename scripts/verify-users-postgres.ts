import path from "node:path";
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnvConfig(path.resolve(process.cwd()), process.env.NODE_ENV !== "production");

async function main() {
  if (!process.env.MONGODB_URI || !process.env.DATABASE_URL) throw new Error("MONGODB_URI and DATABASE_URL are required");
  await mongoose.connect(process.env.MONGODB_URI, { readPreference: "secondaryPreferred" });
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const source = await mongoose.connection.collection("users").find({}, { projection: { _id: 1, email: 1, fullName: 1, mobileNumber: 1, role: 1, status: 1 } }).toArray();
  const target = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, mobileNumber: true, role: true, status: true } });
  const byId = new Map(target.map((user) => [user.id, user]));
  const missing: string[] = [], mismatched: string[] = [];
  for (const user of source) { const found = byId.get(String(user._id)); if (!found) missing.push(String(user._id)); else if (found.email !== String(user.email || "").toLowerCase() || found.fullName !== user.fullName) mismatched.push(String(user._id)); }
  console.log(JSON.stringify({ mongoUsers: source.length, postgresUsers: target.length, missingIds: missing, importantFieldMismatches: mismatched }, null, 2));
  await prisma.$disconnect(); await mongoose.disconnect();
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
