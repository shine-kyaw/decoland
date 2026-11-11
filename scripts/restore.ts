/*
  Restore a backup file into a database. REPLACES everything in that database.

    npm run restore -- <file.bak> --yes

  Needs DATABASE_URL (the database to fill) and BACKUP_KEY (the key the
  backup was made with). See docs/BACKUP.md for the full procedure. In short:
  restore into a NEW empty database, check it, then point the site at it.

  Steps:
    1. Builds the CMS tables first if the database is empty (payload migrate),
       so the tables match this version of the code.
    2. In ONE transaction: removes foreign keys, empties every table in the
       backup, loads the rows, puts the foreign keys back, moves the id
       counters past the highest id, and checks every table's row count.
    3. If anything fails, including a wrong key or a damaged file, the
       transaction is rolled back and the database is left as it was.
*/
import crypto from "node:crypto";
import fs from "node:fs";
import readline from "node:readline";
import { spawnSync } from "node:child_process";
import { createGunzip } from "node:zlib";
import { Client } from "pg";
import { IV_BYTES, MAGIC, TAG_BYTES, backupKey, quoteIdent } from "../lib/backup";

type Any = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function openBackup(file: string, key: Buffer) {
  const size = fs.statSync(file).size;
  const fd = fs.openSync(file, "r");
  const head = Buffer.alloc(MAGIC.length + IV_BYTES);
  const tag = Buffer.alloc(TAG_BYTES);
  fs.readSync(fd, head, 0, head.length, 0);
  fs.readSync(fd, tag, 0, TAG_BYTES, size - TAG_BYTES);
  fs.closeSync(fd);
  if (!head.subarray(0, MAGIC.length).equals(MAGIC)) throw new Error("This is not a Deco-Land backup file.");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, head.subarray(MAGIC.length));
  decipher.setAuthTag(tag);
  const gunzip = createGunzip();
  let failure: Error | null = null;
  const input = fs.createReadStream(file, { start: head.length, end: size - TAG_BYTES - 1 });
  const lines = readline.createInterface({ input: input.pipe(decipher).pipe(gunzip), crlfDelay: Infinity });
  const fail = (e: Error) => {
    // With a wrong key the bytes come out as noise, so gzip usually fails before GCM's own check.
    failure ??= new Error(`Could not read the backup: wrong BACKUP_KEY, or the file is damaged (${e.message}).`);
    lines.close();
  };
  for (const s of [input, decipher, gunzip]) s.on("error", fail);
  lines.on("error", fail);
  return { lines, failure: () => failure };
}

async function tablesIn(db: Client): Promise<Set<string>> {
  const { rows } = await db.query(
    `SELECT c.relname AS name FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r'`,
  );
  return new Set(rows.map((r) => r.name as string));
}

async function main() {
  const file = process.argv[2];
  if (!file || !fs.existsSync(file)) throw new Error("Usage: npm run restore -- <file.bak> --yes");
  if (!process.argv.includes("--yes")) {
    throw new Error("This REPLACES everything in the database at DATABASE_URL. Add --yes to go ahead.");
  }
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.");
  const key = backupKey();

  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();

  if (!(await tablesIn(db)).has("payload_migrations")) {
    console.log("Empty database: building the CMS tables first (payload migrate)…");
    await db.end();
    const r = spawnSync("npx", ["payload", "migrate"], {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, PAYLOAD_CONFIG_PATH: "payload.config.ts" },
    });
    if (r.status !== 0) throw new Error("payload migrate failed.");
    return main2(file, key);
  }
  return main2(file, key, db);
}

async function main2(file: string, key: Buffer, existing?: Client) {
  const db = existing ?? new Client({ connectionString: process.env.DATABASE_URL });
  if (!existing) await db.connect();
  let header: Any | null = null;
  let end: Any | null = null;
  let fks: Array<{ tbl: string; name: string; def: string }> = [];
  const loaded: Record<string, number> = {};

  await db.query("BEGIN");
  // Open the file only now: readline starts emitting lines at once, and the
  // loop below must already be listening or the first lines are lost.
  const { lines, failure } = openBackup(file, key);
  try {
    for await (const line of lines) {
      if (!line) continue;
      const rec = JSON.parse(line) as Any;
      if (rec.kind === "header") {
        if (rec.format !== "deco-backup") throw new Error("Unknown backup format.");
        header = rec;
        console.log(`Backup from ${rec.createdAt}, ${rec.tables.length} tables.`);
        // Foreign keys off for the load; put back afterwards.
        fks = (
          await db.query(
            `SELECT conrelid::regclass::text AS tbl, conname AS name, pg_get_constraintdef(oid) AS def
               FROM pg_constraint WHERE contype = 'f' AND connamespace = 'public'::regnamespace`,
          )
        ).rows;
        for (const f of fks) await db.query(`ALTER TABLE ${f.tbl} DROP CONSTRAINT ${quoteIdent(f.name)}`);
        const present = await tablesIn(db);
        const wipe = (rec.tables as string[]).filter((t) => present.has(t));
        if (wipe.length) await db.query(`TRUNCATE ${wipe.map(quoteIdent).join(", ")}`);
      } else if (rec.kind === "table") {
        if (!header) throw new Error("Damaged backup: no header.");
        if (!(await tablesIn(db)).has(rec.name)) await db.query(rec.ddl);
        loaded[rec.name] = 0;
      } else if (rec.kind === "rows") {
        const t = quoteIdent(rec.table);
        await db.query(`INSERT INTO ${t} SELECT * FROM json_populate_recordset(NULL::${t}, $1::json)`, [JSON.stringify(rec.rows)]);
        loaded[rec.table] += rec.rows.length;
        if (loaded[rec.table] % 2000 < rec.rows.length) process.stdout.write(`  ${rec.table}: ${loaded[rec.table]} rows\r`);
      } else if (rec.kind === "end") {
        end = rec;
      }
    }
    const f = failure();
    if (f) throw f;
    if (!header || !end) throw new Error("The backup file is incomplete.");

    for (const fk of fks) await db.query(`ALTER TABLE ${fk.tbl} ADD CONSTRAINT ${quoteIdent(fk.name)} ${fk.def}`);

    const seqs = await db.query(
      `SELECT c.relname AS tbl, a.attname AS col, pg_get_serial_sequence(quote_ident(c.relname), a.attname) AS seq
         FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relkind = 'r' AND a.attnum > 0 AND NOT a.attisdropped
          AND pg_get_serial_sequence(quote_ident(c.relname), a.attname) IS NOT NULL`,
    );
    for (const s of seqs.rows) {
      await db.query(`SELECT setval($1, COALESCE((SELECT max(${quoteIdent(s.col)}) FROM ${quoteIdent(s.tbl)}), 0) + 1, false)`, [s.seq]);
    }

    const wrong: string[] = [];
    for (const [t, n] of Object.entries(end.counts as Record<string, number>)) {
      const { rows } = await db.query(`SELECT count(*)::int AS n FROM ${quoteIdent(t)}`);
      if (rows[0].n !== n) wrong.push(`${t}: expected ${n}, got ${rows[0].n}`);
    }
    if (wrong.length) throw new Error(`Row counts don't match:\n  ${wrong.join("\n  ")}`);

    await db.query("COMMIT");
    const total = Object.values(end.counts as Record<string, number>).reduce((a, b) => a + b, 0);
    console.log(`\nRestored ${Object.keys(end.counts).length} tables, ${total} rows. Every count matches the backup.`);
  } catch (err) {
    await db.query("ROLLBACK").catch(() => {});
    throw failure() ?? err;
  } finally {
    await db.end().catch(() => {});
  }
}

main().catch((e) => {
  console.error("\nRestore failed; nothing was changed.\n" + (e instanceof Error ? e.message : e));
  process.exit(1);
});
