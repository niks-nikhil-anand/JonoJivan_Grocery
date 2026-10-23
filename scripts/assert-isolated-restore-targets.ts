import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(process.cwd()), process.env.NODE_ENV !== "production");
const production = [process.env.DATABASE_URL, process.env.BACKUP_DATABASE_URL, process.env.MONGODB_URI].filter(Boolean);
const candidates = [process.env.RESTORE_TEST_DATABASE_URL, process.env.MONGODB_RESTORE_TEST_URI];
if (candidates.some((value) => !value)) throw new Error("Both isolated restore URLs are required");
if (candidates.some((value) => production.includes(value))) throw new Error("Restore target must not equal a production connection URL");
const [postgres, mongo] = candidates.map((value) => new URL(value!));
if (postgres.hostname.includes("-pooler")) throw new Error("Use a direct, non-production PostgreSQL URL for restore testing");
if (!/test|restore|staging|sandbox/i.test(postgres.hostname + postgres.pathname + mongo.hostname + mongo.pathname)) throw new Error("Restore URLs must clearly identify isolated test databases");
console.log(JSON.stringify({ isolatedTargetsValidated: true }));
