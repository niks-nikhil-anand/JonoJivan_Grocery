import prisma from "./prisma";

// All application data is stored in Neon PostgreSQL via the shared Prisma pool.
// Reuse a single in-flight connection request: the home page asks for several
// data sets concurrently, and opening three identical connections delays first
// render when the database is waking up.
let connectionPromise;

export default async function connectDB() {
  if (!connectionPromise) {
    connectionPromise = prisma.$connect().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }
  await connectionPromise;
}
