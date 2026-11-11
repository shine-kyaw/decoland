import React from "react";
import type { Payload } from "payload";
import type { Pool } from "pg";
import { visitSummary, type VisitSummary } from "@/lib/analytics";
import { readBackupStatus, type BackupStatus } from "@/lib/backup";

/*
 * WordPress-style admin home: white "postbox" panels in two columns.
 * Every number is a live count; a failing count shows a dash rather than
 * breaking the page. Sales users only get Welcome, Enquiries and Applications.
 */

type AdminUser = { id?: string | number; email?: string; name?: string; role?: string } & Record<string, unknown>;
type Props = { payload?: Payload; user?: AdminUser | null };
type Doc = Record<string, unknown> & { id: string | number };

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
] as const;

const rel = (value?: unknown): string => {
  if (typeof value !== "string") return "";
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return "";
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const str = (v: unknown, fallback = ""): string => (typeof v === "string" && v.trim() ? v : fallback);

const relTitle = (v: unknown): string => {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return str(o.title) || str(o.name);
  }
  return "";
};

const show = (n: number | null) => (n === null ? "—" : n.toLocaleString("en-GB"));

type LinkItem = { href: string; label: string };

const Links = ({ items }: { items: LinkItem[] }) => (
  <ul className="deco-links">
    {items.map((l) => (
      <li key={l.href}>
        <a href={l.href}>{l.label}</a>
      </li>
    ))}
  </ul>
);

const Box = ({
  title,
  children,
  wide,
  action,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  action?: LinkItem;
}) => (
  <section className={`deco-box${wide ? " deco-box--wide" : ""}`}>
    <header className="deco-box__head">
      <h2 className="deco-box__title">{title}</h2>
      {action && (
        <a className="deco-box__action" href={action.href}>
          {action.label}
        </a>
      )}
    </header>
    <div className="deco-box__body">{children}</div>
  </section>
);

export const Dashboard = async ({ payload, user }: Props) => {
  const isSales = user?.role === "sales";
  const name = (user?.name || user?.email?.split("@")[0] || "there").toString().replace(/^\w/, (c) => c.toUpperCase());

  const count = async (collection: string, where?: Record<string, unknown>): Promise<number | null> => {
    if (!payload) return null;
    try {
      const res = await payload.count({
        collection: collection as never,
        where: where as never,
        overrideAccess: false,
        user: user as never,
      });
      return res.totalDocs;
    } catch {
      return null;
    }
  };

  const list = async (collection: string, limit: number, sort: string, depth = 0): Promise<Doc[] | null> => {
    if (!payload) return null;
    try {
      const res = await payload.find({
        collection: collection as never,
        limit,
        sort,
        depth,
        overrideAccess: false,
        user: user as never,
      });
      return res.docs as unknown as Doc[];
    } catch {
      return null;
    }
  };

  // Inbox data (everyone)
  const [statusCounts, newestEnquiries, newestApps] = await Promise.all([
    Promise.all(STATUSES.map((s) => count("enquiries", { status: { equals: s.value } }))),
    list("enquiries", 5, "-createdAt"),
    list("applications", 3, "-createdAt", 1),
  ]);

  // Content data (not for sales)
  let glance: { label: string; href: string; n: number | null }[] = [];
  let activity: { id: string | number; title: string; type: string; collection: string; updatedAt?: string }[] | null = [];
  if (!isSales) {
    const [pages, products, posts, jobs, downloads, media] = await Promise.all([
      count("pages"),
      count("products"),
      count("posts"),
      count("jobs", { open: { equals: true } }),
      count("downloads"),
      count("media"),
    ]);
    glance = [
      { label: "Pages", href: "/admin/collections/pages", n: pages },
      { label: "Products", href: "/admin/collections/products", n: products },
      { label: "News & CSR posts", href: "/admin/collections/posts", n: posts },
      { label: "Jobs open", href: "/admin/collections/jobs", n: jobs },
      { label: "Downloads", href: "/admin/collections/downloads", n: downloads },
      { label: "Media items", href: "/admin/collections/media", n: media },
    ];
    const kinds = [
      { collection: "pages", type: "Page" },
      { collection: "products", type: "Product" },
      { collection: "posts", type: "Post" },
    ];
    const results = await Promise.all(kinds.map((k) => list(k.collection, 5, "-updatedAt")));
    if (results.every((r) => r === null)) {
      activity = null;
    } else {
      activity = results
        .flatMap((docs, i) =>
          (docs ?? []).map((d) => ({
            id: d.id,
            title: str(d.title, "Untitled"),
            type: kinds[i].type,
            collection: kinds[i].collection,
            updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : undefined,
          })),
        )
        .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
        .slice(0, 5);
    }
  }

  const welcome: { start: LinkItem[]; next: LinkItem[]; more: LinkItem[] } = isSales
    ? {
        start: [
          { href: "/admin/collections/enquiries", label: "Open the enquiries inbox" },
          { href: "/admin/collections/applications", label: "Review job applications" },
        ],
        next: [{ href: "/admin/collections/enquiries?where[status][equals]=new", label: "See new enquiries" }],
        more: [{ href: "/en", label: "View the website" }],
      }
    : {
        start: [
          { href: "/admin/collections/pages?where[slug][equals]=home", label: "Edit the home page" },
          { href: "/en", label: "View the website" },
        ],
        next: [
          { href: "/admin/collections/products/create", label: "Add a product" },
          { href: "/admin/collections/posts/create", label: "Write a news post" },
          { href: "/admin/collections/jobs/create", label: "Add a job" },
        ],
        more: [
          { href: "/admin/collections/media", label: "Media library" },
          { href: "/admin/globals/site-settings", label: "Site settings" },
          { href: "/admin/globals/navigation", label: "Menus" },
        ],
      };

  return (
    <div className="deco-dash">
      <Box title="Welcome" wide>
        <div className="deco-welcome">
          <h3 className="deco-welcome__hello">Welcome to the Deco-Land website admin, {name}.</h3>
          <p className="deco-welcome__sub">
            Everything on the website is edited here. Saved changes appear on the live site within moments.
          </p>
          <div className="deco-welcome__cols">
            <div>
              <h4>Get started</h4>
              <Links items={welcome.start} />
            </div>
            <div>
              <h4>Next steps</h4>
              <Links items={welcome.next} />
            </div>
            <div>
              <h4>More actions</h4>
              <Links items={welcome.more} />
            </div>
          </div>
        </div>
      </Box>

      {user?.role === "admin" && <Backups payload={payload} />}

      {!isSales && <SiteVisits payload={payload} />}

      <div className="deco-cols">
        <div className="deco-col">
          {!isSales && (
            <Box title="At a glance">
              <ul className="deco-glance">
                {glance.map((g) => (
                  <li key={g.label}>
                    <a href={g.href}>
                      <strong>{show(g.n)}</strong> {g.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <Box title="Enquiries" action={{ href: "/admin/collections/enquiries", label: "View all" }}>
            <ul className="deco-statuses">
              {STATUSES.map((s, i) => (
                <li key={s.value}>
                  <a href={`/admin/collections/enquiries?where[status][equals]=${s.value}`}>
                    <strong>{show(statusCounts[i])}</strong> {s.label}
                  </a>
                </li>
              ))}
            </ul>
            {newestEnquiries === null ? (
              <p className="deco-empty">Enquiries could not be loaded just now.</p>
            ) : newestEnquiries.length === 0 ? (
              <p className="deco-empty">No enquiries yet.</p>
            ) : (
              <ul className="deco-rows">
                {newestEnquiries.map((e) => {
                  const status = str(e.status, "new");
                  const label = STATUSES.find((s) => s.value === status)?.label ?? status;
                  const meta = [str(e.company), str(e.topic)].filter(Boolean).join(" · ");
                  return (
                    <li key={e.id}>
                      <a className="deco-row" href={`/admin/collections/enquiries/${e.id}`}>
                        <span className="deco-row__main">
                          <strong>{str(e.name, "Unnamed")}</strong>
                          {meta && <small>{meta}</small>}
                        </span>
                        <span className={`deco-badge deco-badge--${status}`}>{label}</span>
                        <time className="deco-row__date">{rel(e.createdAt)}</time>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </Box>
        </div>

        <div className="deco-col">
          <Box title="Job applications" action={{ href: "/admin/collections/applications", label: "View all" }}>
            {newestApps === null ? (
              <p className="deco-empty">Applications could not be loaded just now.</p>
            ) : newestApps.length === 0 ? (
              <p className="deco-empty">No applications yet.</p>
            ) : (
              <ul className="deco-rows">
                {newestApps.map((a) => {
                  const status = str(a.status, "new");
                  return (
                    <li key={a.id}>
                      <a className="deco-row" href={`/admin/collections/applications/${a.id}`}>
                        <span className="deco-row__main">
                          <strong>{str(a.name, "Unnamed")}</strong>
                          {relTitle(a.job) && <small>{relTitle(a.job)}</small>}
                        </span>
                        <span className={`deco-badge deco-badge--${status}`}>{status.replace(/^\w/, (c) => c.toUpperCase())}</span>
                        <time className="deco-row__date">{rel(a.createdAt)}</time>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </Box>

          {!isSales && (
            <Box title="Activity">
              {activity === null ? (
                <p className="deco-empty">Activity could not be loaded just now.</p>
              ) : activity.length === 0 ? (
                <p className="deco-empty">Nothing has been edited yet.</p>
              ) : (
                <ul className="deco-rows">
                  {activity.map((a) => (
                    <li key={`${a.collection}-${a.id}`}>
                      <a className="deco-row" href={`/admin/collections/${a.collection}/${a.id}`}>
                        <span className="deco-row__main">
                          <strong>{a.title}</strong>
                          <small>{a.type}</small>
                        </span>
                        <time className="deco-row__date">{rel(a.updatedAt)}</time>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Nightly backup status (lib/backup.ts, app/api/cron/backup) ───────── */
async function Backups({ payload }: { payload: Props["payload"] }) {
  let s: BackupStatus | null = null;
  try {
    if (payload) s = await readBackupStatus((payload.db as unknown as { pool: Pool }).pool);
  } catch {
    s = null;
  }
  const okAt = s?.ok ? new Date(s.ok.at).getTime() : 0;
  const errAt = s?.error ? new Date(s.error.at).getTime() : 0;
  const stale = !okAt || Date.now() - okAt > 36 * 3600_000;
  const failing = errAt > okAt;
  const when = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Yangon", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  const mb = (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`;
  const tone = s === null ? "" : failing || stale ? " deco-backup--warn" : " deco-backup--ok";
  return (
    <Box title="Backups" wide>
      <div className={`deco-backup${tone}`}>
        {s === null ? (
          <p className="deco-empty">Backup status could not be loaded just now.</p>
        ) : (
          <>
            <p>
              {s.ok ? (
                <>Last backup: <strong>{when(s.ok.at)}</strong> ({rel(s.ok.at)}), {mb(s.ok.bytes)}, {s.ok.rows.toLocaleString("en-US")} records.</>
              ) : (
                <>No backup has been taken yet. The first one runs tonight at 03:00 Yangon time.</>
              )}
            </p>
            {failing && s.error && <p>The latest backup failed on {when(s.error.at)}. Please tell Aster.</p>}
            {!failing && stale && s.ok && <p>There has been no backup for over a day. Please tell Aster.</p>}
            <p className="deco-visits__note">A copy of the whole database is saved every night and kept for 30 days, encrypted.</p>
          </>
        )}
      </div>
    </Box>
  );
}

/* ── Site visits (privacy-friendly counter, lib/analytics.ts) ─────────── */
async function SiteVisits({ payload }: { payload: Props["payload"] }) {
  let v: VisitSummary | null = null;
  try {
    if (payload) v = await visitSummary(payload);
  } catch {
    v = null;
  }
  const max = Math.max(1, ...(v?.days.map((d) => d.views) ?? [1]));
  const n = (x: number) => x.toLocaleString("en-US");
  return (
    <Box title="Site visits — last 30 days" wide>
      {v === null ? (
        <p className="deco-empty">Visits could not be loaded just now.</p>
      ) : (
        <div className="deco-visits">
          <div className="deco-visits__nums">
            <div><strong>{n(v.today)}</strong><span>Today</span></div>
            <div><strong>{n(v.last7)}</strong><span>Last 7 days</span></div>
            <div><strong>{n(v.last30)}</strong><span>Last 30 days</span></div>
          </div>
          <svg className="deco-visits__chart" viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Page views per day, last 30 days">
            {v.days.map((d, i) => {
              const h = Math.max(1, (d.views / max) * 56);
              return (
                <rect key={d.day} x={i * 10 + 1} y={60 - h} width={8} height={h} rx={1.5}>
                  <title>{`${d.day}: ${d.views}`}</title>
                </rect>
              );
            })}
          </svg>
          <div className="deco-visits__lists">
            <div>
              <h4>Top pages</h4>
              {v.topPages.length ? (
                <ol>{v.topPages.map((p) => <li key={p.path}><span>{p.path}</span><b>{n(p.views)}</b></li>)}</ol>
              ) : <p className="deco-empty">No visits yet.</p>}
            </div>
            <div>
              <h4>Most viewed products</h4>
              {v.topProducts.length ? (
                <ol>{v.topProducts.map((p) => <li key={p.slug}><span>{p.slug.replace(/-/g, " ")}</span><b>{n(p.views)}</b></li>)}</ol>
              ) : <p className="deco-empty">No product views yet.</p>}
            </div>
          </div>
          <p className="deco-visits__note">Counted without cookies or personal data. Bots are excluded.</p>
        </div>
      )}
    </Box>
  );
}

export default Dashboard;
