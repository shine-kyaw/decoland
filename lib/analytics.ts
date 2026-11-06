import type { Pool } from "pg";
import type { Payload } from "payload";

/*
  Privacy-friendly site visits: one row per (day, page) with a counter.
  No cookies, no IP addresses, no user agents stored, nothing sent to a third
  party — so no consent banner is needed. Bots are filtered by user agent
  before counting.

  The table lives outside Payload's schema (like the media blobs), so it
  needs no migration and can't collide with generated tables.
*/

const TABLE = "deco_page_views";
let ensured: Promise<unknown> | null = null;

const poolOf = (payload: Payload): Pool => (payload.db as unknown as { pool: Pool }).pool;

function ensure(pool: Pool) {
  if (!ensured) {
    ensured = pool.query(
      `CREATE TABLE IF NOT EXISTS ${TABLE} (
         day   date    NOT NULL,
         path  text    NOT NULL,
         views integer NOT NULL DEFAULT 0,
         PRIMARY KEY (day, path)
       )`,
    );
  }
  return ensured;
}

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|pingdom|uptime|curl|wget|python|node-fetch|axios/i;
export const isBot = (ua: string | null) => !ua || BOT.test(ua);

/** Normalise and accept only public site paths: /en/…, /my/… */
export function cleanPath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const p = raw.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (!/^\/(en|my)(\/[a-z0-9\-/]*)?$/i.test(p) || p.length > 200) return null;
  return p.toLowerCase();
}

export async function recordView(payload: Payload, path: string) {
  const pool = poolOf(payload);
  await ensure(pool);
  // Myanmar time (UTC+6:30), so "today" matches the office day.
  await pool.query(
    `INSERT INTO ${TABLE} (day, path, views)
     VALUES ((now() AT TIME ZONE 'Asia/Yangon')::date, $1, 1)
     ON CONFLICT (day, path) DO UPDATE SET views = ${TABLE}.views + 1`,
    [path],
  );
}

export type VisitSummary = {
  days: Array<{ day: string; views: number }>;
  today: number;
  last7: number;
  last30: number;
  topPages: Array<{ path: string; views: number }>;
  topProducts: Array<{ slug: string; views: number }>;
};

/** Last 30 days, for the admin dashboard. */
export async function visitSummary(payload: Payload): Promise<VisitSummary> {
  const pool = poolOf(payload);
  await ensure(pool);
  const since = `(now() AT TIME ZONE 'Asia/Yangon')::date - 29`;
  const [daily, pages, products] = await Promise.all([
    pool.query(
      `SELECT d::date AS day, COALESCE(SUM(v.views), 0)::int AS views
         FROM generate_series(${since}, (now() AT TIME ZONE 'Asia/Yangon')::date, '1 day') d
         LEFT JOIN ${TABLE} v ON v.day = d::date
        GROUP BY d ORDER BY d`,
    ),
    pool.query(
      `SELECT regexp_replace(path, '^/(en|my)', '') AS path, SUM(views)::int AS views
         FROM ${TABLE} WHERE day >= ${since}
        GROUP BY 1 ORDER BY 2 DESC LIMIT 5`,
    ),
    pool.query(
      `SELECT regexp_replace(path, '^/(en|my)/products/', '') AS slug, SUM(views)::int AS views
         FROM ${TABLE} WHERE day >= ${since} AND path ~ '^/(en|my)/products/.+'
        GROUP BY 1 ORDER BY 2 DESC LIMIT 5`,
    ),
  ]);
  const days = daily.rows.map((r: { day: Date | string; views: number }) => ({
    day: typeof r.day === "string" ? r.day.slice(0, 10) : r.day.toISOString().slice(0, 10),
    views: Number(r.views),
  }));
  const sum = (n: number) => days.slice(-n).reduce((a, d) => a + d.views, 0);
  return {
    days,
    today: days.at(-1)?.views ?? 0,
    last7: sum(7),
    last30: sum(30),
    topPages: pages.rows.map((r: { path: string; views: number }) => ({ path: r.path || "/", views: Number(r.views) })),
    topProducts: products.rows.map((r: { slug: string; views: number }) => ({ slug: r.slug, views: Number(r.views) })),
  };
}
