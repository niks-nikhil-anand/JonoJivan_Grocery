import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the PostgreSQL database connection.");
}

const createClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

// Keep one pool while Next.js reloads server modules in development.
// Regeneration can add models while a development server is still running.
const cachedClient = globalForPrisma.__jonojivanPrisma;
const prisma = cachedClient?.vendorTicket ? cachedClient : createClient();
if (cachedClient && cachedClient !== prisma) {
  cachedClient.$disconnect().catch(() => {});
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__jonojivanPrisma = prisma;
}

export default prisma;
