import path from "node:path";
import fs from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createReadStream, createWriteStream } from "node:fs";
import { createGunzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(process.cwd()), process.env.NODE_ENV !== "production");
const run = promisify(execFile);

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  const tools = process.env.MONGODB_TOOLS_BIN || "C:\\Program Files\\MongoDB\\Tools\\100\\bin";
  const dump = path.join(tools, "mongodump.exe");
  if (!fs.existsSync(dump)) throw new Error("mongodump is required; set MONGODB_TOOLS_BIN");
  const dir = path.resolve(process.cwd(), "backups"); fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `jonojivan-mongodb-${new Date().toISOString().replace(/[:.]/g, "-")}.archive.gz`);
  if (fs.existsSync(file)) throw new Error("Refusing to overwrite an existing backup");
  try { await run(dump, ["--uri", process.env.MONGODB_URI, "--archive=" + file, "--gzip"], { windowsHide: true, timeout: 120000 }); }
  catch (error) { throw new Error(`mongodump failed (exit ${error?.code ?? "unknown"}): ${String(error?.stderr || error?.message || "").replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, "[redacted-url]")}`); }
  if (!fs.statSync(file).size) throw new Error("Backup archive is empty");
  // mongorestore --dryRun still connects to a server, so it cannot validate an
  // archive offline. Fully decompressing verifies gzip integrity without writes.
  await pipeline(createReadStream(file), createGunzip(), createWriteStream("NUL"));
  console.log(JSON.stringify({ created: path.basename(file), bytes: fs.statSync(file).size, gzipIntegrityVerified: true, isolatedRestorePending: true }));
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
