/*
  Take a backup to a local file, the same file the nightly job writes.

    npm run backup -- [output-file]

  Needs DATABASE_URL and BACKUP_KEY. Default file: ./decoland-<date>.bak
*/
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { Client } from "pg";
import { createBackup } from "../lib/backup";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.");
  const file = process.argv[2] || `decoland-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}Z.bak`;
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  try {
    const { stream, done } = createBackup(db);
    const [, summary] = await Promise.all([pipeline(stream, fs.createWriteStream(file)), done]);
    console.log(`Backup written to ${file}: ${summary.tables} tables, ${summary.rows} rows, ${(summary.bytes / 1024 / 1024).toFixed(2)} MB`);
  } finally {
    await db.end();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
