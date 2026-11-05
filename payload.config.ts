import path from "path";
import { fileURLToPath } from "url";
import { buildConfig, type CollectionConfig, type GlobalConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import sharp from "sharp";

import { postgresStorage } from "./payload/postgresStorage";
import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Pages, Posts, PostCategories } from "./payload/collections/content";
import { Products, ProductCategories, Brands } from "./payload/collections/catalogue";
import { GroupCompanies, Jobs, Downloads } from "./payload/collections/company";
import { Enquiries, Applications, PrivateFiles } from "./payload/collections/inbox";
import { SiteSettings, Navigation } from "./payload/globals";
import { refreshAfterChange, refreshAfterDelete, refreshAfterGlobalChange } from "./payload/revalidate";

/*
  The CMS switches on when DATABASE_URL is set. Without it the public site
  still builds and serves its built-in content (lib/content.*.ts), so it can
  never be taken down by the CMS being unconfigured. See docs/CMS-PLAN.md.
*/
const databaseUrl = process.env.DATABASE_URL || "";
if (databaseUrl && process.env.NODE_ENV === "production" && !process.env.PAYLOAD_SECRET) {
  throw new Error("PAYLOAD_SECRET must be set in production when DATABASE_URL is configured.");
}
const secret = process.env.PAYLOAD_SECRET || "decoland-cms-not-configured";
const poolMax = Math.min(10, Math.max(2, Number.parseInt(process.env.DATABASE_POOL_MAX || "3", 10) || 3));

// Every content save refreshes the public site (see ./payload/revalidate).
const withRefresh = (c: CollectionConfig): CollectionConfig => ({
  ...c,
  hooks: {
    ...c.hooks,
    afterChange: [...(c.hooks?.afterChange ?? []), refreshAfterChange],
    afterDelete: [...(c.hooks?.afterDelete ?? []), refreshAfterDelete],
  },
});
const withGlobalRefresh = (g: GlobalConfig): GlobalConfig => ({
  ...g,
  hooks: { ...g.hooks, afterChange: [...(g.hooks?.afterChange ?? []), refreshAfterGlobalChange] },
});

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: "light",
    meta: {
      titleSuffix: " ‹ Deco-Land — Website admin",
      icons: [{ rel: "icon", type: "image/png", url: "/photos/Logo_Gold_noBg.png" }],
    },
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      graphics: { Icon: "/components/admin/Icon#Icon", Logo: "/components/admin/Logo#Logo" },
      // WordPress-style dashboard: At a glance, recent enquiries, quick links.
      beforeDashboard: ["/components/admin/Dashboard#Dashboard"],
      // Keep the sidebar open on laptop screens, like WordPress.
      providers: ["/components/admin/KeepNavOpen#KeepNavOpen"],
    },
  },
  localization: {
    locales: [
      { code: "en", label: "English" },
      { code: "my", label: "မြန်မာ (Burmese)" },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  collections: [
    ...[Pages, Posts, PostCategories, Products, ProductCategories, Brands, GroupCompanies, Jobs, Downloads, Media].map(withRefresh),
    // Inbox and account changes never alter the public site.
    Enquiries,
    Applications,
    PrivateFiles,
    Users,
  ],
  globals: [SiteSettings, Navigation].map(withGlobalRefresh),
  editor: lexicalEditor(),
  upload: { abortOnLimit: true, limits: { fileSize: 20 * 1024 * 1024 } },
  secret,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl || "postgres://cms-not-configured/unused",
      max: poolMax,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    },
    // Schema changes go through migration files, never an automatic push.
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  plugins: [
    postgresStorage(),
    // Yoast-style SEO tab with a Google preview on pages, posts and products.
    seoPlugin({
      collections: ["pages", "posts", "products"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: ({ doc }) => `${(doc as { title?: string }).title ?? ""} | Deco-Land`,
      generateDescription: ({ doc }) => (doc as { summary?: string; excerpt?: string }).summary ?? (doc as { excerpt?: string }).excerpt ?? "",
    }),
  ],
  sharp,
});
