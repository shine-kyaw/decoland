# Database backups

The website's database holds every page, product, post, setting, uploaded photo and PDF, enquiry and job application (including CVs). It is protected in two independent ways:

1. **Neon's own restore history** (paid plan). This rewinds the whole database to any moment in the last few days. It's the fastest fix for "someone deleted something yesterday".
2. **A nightly copy** made by the website itself. A full, encrypted copy of the database is saved **every night at 03:00 Yangon time** to a private Vercel Blob store in Deco-Land's Vercel team. Copies are kept for **30 days**, and the newest 7 are always kept. This one survives even a problem at Neon.

The admin dashboard shows a **Backups** panel to administrators: when the last copy was made and how big it was. It warns if the last backup failed, or if there has been none for over a day.

## Setting it up (once, in Deco-Land's Vercel team)

1. Vercel → decoland → **Storage** → **Create** → **Blob**. Name it `decoland-backups`, set **Access: Private**, and connect it to the decoland project for **Production**. This sets `BLOB_READ_WRITE_TOKEN`.
2. Settings → Environment Variables → add for **Production**:
   - `BACKUP_KEY`: the value in `.env.production.local`.
   - `CRON_SECRET`: the value in `.env.production.local`.
3. **Before deleting `.env.production.local`, save `BACKUP_KEY` in Deco-Land's password manager**, and give Aster a copy. Without this key no backup can ever be opened. Vercel hides "sensitive" values once saved, so Vercel can't be the only place it's kept.
4. Redeploy. The schedule is in `vercel.json` (`30 20 * * *` UTC = 03:00 Yangon). Vercel → decoland → **Settings → Cron Jobs** lists it and has a **Run** button to take a backup immediately. Use it once to check: the Backups panel on the dashboard should turn green.

## How a backup is made

- `app/api/cron/backup/route.ts` runs nightly. Only Vercel's scheduler can call it: it needs `CRON_SECRET`.
- `lib/backup.ts` reads every table inside **one consistent snapshot**, so editors saving at the same moment can't produce a half-old, half-new copy.
- The file is compressed, then **encrypted with AES-256-GCM** using `BACKUP_KEY`. Even someone holding the file can't read the CVs or enquiries inside it without the key. GCM also detects any damaged or altered byte.
- The file is named `backups/decoland-<date>.bak`.

To take a copy by hand to your own computer (needs the database address and the key):

```bash
DATABASE_URL="postgres://…" BACKUP_KEY="…" npm run backup -- decoland-copy.bak
```

## Restoring

**Use Neon's restore first** if the problem is recent (within its restore window): Neon console → the project → **Restore** / branch from a point in time. It's quicker and doesn't need the steps below.

To restore from a nightly copy:

1. Download the `.bak` file: Vercel → Storage → `decoland-backups` → `backups/` → the date you want → Download.
2. Create a **new, empty** database, for example a new Neon branch or project. Don't restore over the live one until you've checked the result.
3. On a computer with the website's code:
   ```bash
   DATABASE_URL="<the NEW database>" BACKUP_KEY="<the key>" npm run restore -- decoland-2026-…bak --yes
   ```
   - It builds the CMS tables first if the database is empty, then loads everything in **one transaction**.
   - It ends with `Restored N tables, N rows. Every count matches the backup.`
   - If anything goes wrong (a wrong key, a damaged file, a count mismatch) it rolls back and changes nothing.
4. Point the website at the restored database: change `DATABASE_URL` in Vercel, then redeploy. Check the site and admin, and keep the old database until you're sure.

## Tested (11 Nov 2026, local Postgres)

- Backup of the full seeded CMS: 203 tables, 3,473 rows plus two 3 MB binary files, in a 6.6 MB file.
- Restore into an empty database: migrations ran, then all 203 tables loaded in about 30 seconds. **Every table's content fingerprint matched the source.** The binary files came back byte-for-byte, and new records continue from the right ID numbers.
- Restoring again over existing data gave the same identical result.
- A wrong key, a damaged file, and a missing `--yes` were each refused with nothing changed.
- **Not yet tested:** the upload to Vercel Blob and the cron schedule. They need Deco-Land's team, so check them with the **Run** button in step 4 of the setup.
