import prisma from "./prisma";

// All application data is stored in Neon PostgreSQL via the shared Prisma pool.
export default async function connectDB() {
  await prisma.$connect();
}
