import path from "node:path";
import fs from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(process.cwd()), process.env.NODE_ENV !== "production");
const run = promisify(execFile);

async function main() {
  const connectionUrl = process.env.BACKUP_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionUrl) throw new Error("BACKUP_DATABASE_URL or DATABASE_URL is required");
  const clientDir = process.env.POSTGRES_BIN || "C:\\Program Files\\PostgreSQL\\18\\bin";
  const pgDump = path.join(clientDir, "pg_dump.exe");
  const pgRestore = path.join(clientDir, "pg_restore.exe");
  if (!fs.existsSync(pgDump) || !fs.existsSync(pgRestore)) throw new Error("pg_dump and pg_restore are required; set POSTGRES_BIN if needed");
  const backupDir = path.resolve(process.cwd(), "backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const output = path.join(backupDir, `jonojivan-postgres-${stamp}.dump`);
  if (fs.existsSync(output)) throw new Error("Refusing to overwrite an existing backup");
  const url = new URL(connectionUrl);
  const env = { ...process.env, PGHOST: url.hostname, PGPORT: url.port || "5432", PGUSER: decodeURIComponent(url.username), PGPASSWORD: decodeURIComponent(url.password), PGDATABASE: url.pathname.slice(1), PGSSLMODE: url.searchParams.get("sslmode") || "require" };
  try {
    await run(pgDump, ["--format=custom", "--file", output], { windowsHide: true, env, timeout: 120000 });
  } catch (error) {
    const detail = String(error?.stderr || error?.message || "pg_dump failed").replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[redacted-url]");
    throw new Error(`pg_dump failed (exit ${error?.code ?? "unknown"}): ${detail}`);
  }
  if (!fs.statSync(output).size) throw new Error("Backup file is empty");
  await run(pgRestore, ["--list", output], { windowsHide: true, env });
  console.log(JSON.stringify({ created: path.basename(output), verified: true }));
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
