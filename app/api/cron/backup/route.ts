/*
  GET /api/cron/backup — the nightly database backup.

  Vercel Cron calls this every night (vercel.json → crons; 20:30 UTC is
  03:00 in Yangon). It writes one encrypted file (lib/backup.ts) to the
  PRIVATE Vercel Blob store in Deco-Land's team, under backups/, and deletes
  copies older than 30 days, always keeping the newest 7.

  Env:
    CRON_SECRET            Vercel sends it as "Authorization: Bearer …";
                           every other caller is refused.
    BACKUP_KEY             64 hex characters; encrypts the file.
    BLOB_READ_WRITE_TOKEN  set by Vercel when a Blob store is connected.
    DATABASE_URL           the database being backed up.

  The result (or the error) is saved in deco_cms_meta and shown on the admin
  dashboard, so a failing backup is visible without opening Vercel.
*/

import { del, list, put } from "@vercel/blob";
import { Client } from "pg";
import { backupKey, createBackup, recordBackupStatus } from "@/lib/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const KEEP_DAYS = 30;
const KEEP_AT_LEAST = 7;

const json = (status: number, body: unknown) => Response.json(body, { status });

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return json(401, { ok: false });

  const missing = ["DATABASE_URL", "BACKUP_KEY", "BLOB_READ_WRITE_TOKEN"].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error("[backup] not configured, missing:", missing.join(", "));
    return json(503, { ok: false, reason: "unconfigured", missing });
  }

  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const pathname = `backups/decoland-${stamp}Z.bak`;
    const { stream, done } = createBackup(db, backupKey());
    const [blob, summary] = await Promise.all([
      put(pathname, stream, {
        access: "private",
        multipart: true,
        addRandomSuffix: false,
        contentType: "application/octet-stream",
      }),
      done,
    ]);
    await prune();
    await recordBackupStatus(db, "last_backup", { at: new Date().toISOString(), file: blob.pathname, bytes: summary.bytes, rows: summary.rows });
    console.log(`[backup] ${blob.pathname}: ${summary.tables} tables, ${summary.rows} rows, ${summary.bytes} bytes`);
    return json(200, { ok: true, file: blob.pathname, ...summary, counts: undefined });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[backup] failed:", err);
    await recordBackupStatus(db, "last_backup_error", { at: new Date().toISOString(), message: message.slice(0, 300) }).catch(() => {});
    return json(500, { ok: false, reason: "backup-failed" });
  } finally {
    await db.end().catch(() => {});
  }
}

/** Delete backups older than KEEP_DAYS, but never the newest KEEP_AT_LEAST. */
async function prune() {
  const blobs: Array<{ url: string; uploadedAt: Date }> = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "backups/", limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  const cutoff = Date.now() - KEEP_DAYS * 86400_000;
  const old = blobs.slice(KEEP_AT_LEAST).filter((b) => +new Date(b.uploadedAt) < cutoff);
  if (old.length) await del(old.map((b) => b.url));
}
