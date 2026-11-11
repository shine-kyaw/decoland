/*
  Database backup: one encrypted file holding every table in the database.

  What's in the file: every table in the public schema, each with a recipe to
  recreate it if it's missing (for our own deco_* tables, which are not made by
  Payload's migrations), followed by its rows as JSON.

  The dump is taken inside one REPEATABLE READ transaction, so the copy is a
  consistent snapshot even while editors are saving.

  On disk:   "DECOBAK1" | 12-byte IV | AES-256-GCM( gzip( NDJSON ) ) | 16-byte tag
  Key:       BACKUP_KEY, 64 hex characters (32 bytes). Without the key a
             backup cannot be read, so keep the key somewhere other than the
             backups (a password manager).

  Used by: app/api/cron/backup (nightly, to Vercel Blob), scripts/backup.ts
  (a local file) and scripts/restore.ts (the way back).
*/

import crypto from "node:crypto";
import { PassThrough, Readable, Transform, type TransformCallback } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import type { Client, Pool } from "pg";

export const MAGIC = Buffer.from("DECOBAK1");
export const IV_BYTES = 12;
export const TAG_BYTES = 16;
export const META_TABLE = "deco_cms_meta";

type Queryable = Pick<Client, "query"> | Pick<Pool, "query">;

export const quoteIdent = (name: string) => `"${name.replace(/"/g, '""')}"`;

export function backupKey(): Buffer {
  const hex = (process.env.BACKUP_KEY || "").trim();
  if (!/^[0-9a-f]{64}$/i.test(hex)) throw new Error("BACKUP_KEY must be 64 hex characters (32 bytes).");
  return Buffer.from(hex, "hex");
}

/** AES-256-GCM as a stream: writes the header first and the auth tag last. */
class Encrypt extends Transform {
  private cipher: crypto.CipherGCM;
  bytes = 0;
  constructor(key: Buffer) {
    super();
    const iv = crypto.randomBytes(IV_BYTES);
    this.cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    this.out(Buffer.concat([MAGIC, iv]));
  }
  private out(b: Buffer) {
    if (b.length) {
      this.bytes += b.length;
      this.push(b);
    }
  }
  _transform(chunk: Buffer, _enc: BufferEncoding, cb: TransformCallback) {
    this.out(this.cipher.update(chunk));
    cb();
  }
  _flush(cb: TransformCallback) {
    this.out(this.cipher.final());
    this.out(this.cipher.getAuthTag());
    cb();
  }
}

export type BackupSummary = { tables: number; rows: number; counts: Record<string, number>; bytes: number };

type Column = { name: string; type: string; notnull: boolean; def: string | null };

async function tableRecipe(db: Queryable, table: string): Promise<{ columns: Column[]; ddl: string }> {
  const cols = await db.query(
    `SELECT a.attname AS name, format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS notnull,
            pg_get_expr(d.adbin, d.adrelid) AS def
       FROM pg_attribute a
       LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
      WHERE a.attrelid = $1::regclass AND a.attnum > 0 AND NOT a.attisdropped
      ORDER BY a.attnum`,
    [quoteIdent(table)],
  );
  const pk = await db.query(
    `SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid = $1::regclass AND contype = 'p'`,
    [quoteIdent(table)],
  );
  const columns = cols.rows as Column[];
  const parts = columns.map((c) => {
    // Sequence defaults are left out: the sequence would not exist on a fresh database.
    const def = c.def && !/nextval\(/i.test(c.def) ? ` DEFAULT ${c.def}` : "";
    return `${quoteIdent(c.name)} ${c.type}${c.notnull ? " NOT NULL" : ""}${def}`;
  });
  if (pk.rows[0]) parts.push(pk.rows[0].def);
  return { columns, ddl: `CREATE TABLE IF NOT EXISTS ${quoteIdent(table)} (${parts.join(", ")})` };
}

async function* dumpLines(db: Queryable, summary: BackupSummary): AsyncGenerator<string> {
  await db.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
  try {
    const { rows } = await db.query(
      `SELECT c.relname AS name FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relkind = 'r' ORDER BY c.relname`,
    );
    const tables = rows.map((r: { name: string }) => r.name);
    yield JSON.stringify({ kind: "header", format: "deco-backup", version: 1, createdAt: new Date().toISOString(), tables }) + "\n";

    for (const table of tables) {
      const { columns, ddl } = await tableRecipe(db, table);
      yield JSON.stringify({ kind: "table", name: table, ddl }) + "\n";
      // Rows holding files (bytea) can be megabytes each, so fetch those a few at a time.
      const batch = columns.some((c) => c.type === "bytea") ? 4 : 500;
      await db.query(`DECLARE deco_dump NO SCROLL CURSOR FOR SELECT row_to_json(x)::text AS j FROM ${quoteIdent(table)} x`);
      let n = 0;
      for (;;) {
        const r = await db.query(`FETCH ${batch} FROM deco_dump`);
        if (!r.rows.length) break;
        n += r.rows.length;
        yield `{"kind":"rows","table":${JSON.stringify(table)},"rows":[${r.rows.map((x: { j: string }) => x.j).join(",")}]}\n`;
      }
      await db.query("CLOSE deco_dump");
      summary.counts[table] = n;
      summary.rows += n;
      summary.tables += 1;
    }
    yield JSON.stringify({ kind: "end", counts: summary.counts }) + "\n";
    await db.query("COMMIT");
  } catch (err) {
    await db.query("ROLLBACK").catch(() => {});
    throw err;
  }
}

/**
 * Start a backup. `stream` is the encrypted file; `done` resolves with what
 * went into it once the last byte has been written. Give the function a
 * dedicated connection (a pg Client), not a pool: the snapshot and the cursor
 * live on one connection.
 */
export function createBackup(db: Pick<Client, "query">, key = backupKey()): { stream: Readable; done: Promise<BackupSummary> } {
  const summary: BackupSummary = { tables: 0, rows: 0, counts: {}, bytes: 0 };
  const enc = new Encrypt(key);
  const out = new PassThrough();
  const done = pipeline(Readable.from(dumpLines(db, summary)), createGzip({ level: 6 }), enc, out).then(() => {
    summary.bytes = enc.bytes;
    return summary;
  });
  done.catch((err) => out.destroy(err));
  return { stream: out, done };
}

/* ── Status, shown on the admin dashboard ───────────────────────────────── */

export type BackupStatus = {
  ok?: { at: string; file: string; bytes: number; rows: number };
  error?: { at: string; message: string };
};

async function ensureMeta(db: Queryable) {
  await db.query(
    `CREATE TABLE IF NOT EXISTS ${META_TABLE} (key text PRIMARY KEY, value text, at timestamptz NOT NULL DEFAULT now())`,
  );
}

export async function recordBackupStatus(db: Queryable, key: "last_backup" | "last_backup_error", value: object) {
  await ensureMeta(db);
  await db.query(
    `INSERT INTO ${META_TABLE} (key, value, at) VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, at = now()`,
    [key, JSON.stringify(value)],
  );
}

export async function readBackupStatus(db: Queryable): Promise<BackupStatus> {
  await ensureMeta(db);
  const { rows } = await db.query(`SELECT key, value FROM ${META_TABLE} WHERE key IN ('last_backup', 'last_backup_error')`);
  const status: BackupStatus = {};
  for (const r of rows as Array<{ key: string; value: string }>) {
    try {
      if (r.key === "last_backup") status.ok = JSON.parse(r.value);
      else status.error = JSON.parse(r.value);
    } catch {
      /* ignore a damaged row */
    }
  }
  return status;
}
