/*
  CMS access layer: the only place pages read Payload content from.

    CMS on  (DATABASE_URL set) → content comes from Payload.
    CMS off                    → every getter returns null / [] and pages fall
                                 back to the built-in content in lib/content.*.ts.

  Reads are cached and tagged "cms"; every save in the admin invalidates the
  tag (payload/revalidate.ts), so pages load at static speed yet show edits at
  once. A failed read is logged and degrades to the built-in content — the
  public site never goes down because of the database.
*/
import { unstable_cache } from "next/cache";
import { getCms, isCmsEnabled } from "@/lib/payload";
import type { Locale } from "@/lib/site";
import type { BlockContext } from "@/lib/cms-types";

export const CMS_CACHE_TAG = "cms";
type Doc = Record<string, unknown> & { id: string | number };
type Where = Record<string, unknown>;

async function find(collection: string, lang: Locale, where: Where = {}, opts: { limit?: number; sort?: string; depth?: number } = {}): Promise<Doc[]> {
  if (!isCmsEnabled()) return [];
  const key = JSON.stringify([collection, lang, where, opts]);
  return unstable_cache(
    async () => {
      try {
        const payload = await getCms();
        const res = await payload!.find({
          collection: collection as never,
          locale: lang,
          fallbackLocale: "en",
          where: where as never,
          limit: opts.limit ?? 100,
          sort: opts.sort,
          depth: opts.depth ?? 1,
          overrideAccess: false, // public read rules: published only
          pagination: false,
        });
        return res.docs as unknown as Doc[];
      } catch (err) {
        console.error(`[cms] reading ${collection} failed; using built-in content`, err);
        return [];
      }
    },
    ["cms", key],
    { tags: [CMS_CACHE_TAG] },
  )();
}

async function global(slug: string, lang: Locale): Promise<Doc | null> {
  if (!isCmsEnabled()) return null;
  return unstable_cache(
    async () => {
      try {
        const payload = await getCms();
        return (await payload!.findGlobal({ slug: slug as never, locale: lang, fallbackLocale: "en", depth: 1 })) as unknown as Doc;
      } catch (err) {
        console.error(`[cms] reading global ${slug} failed`, err);
        return null;
      }
    },
    ["cms-global", slug, lang],
    { tags: [CMS_CACHE_TAG] },
  )();
}

export const getPage = async (slug: string, lang: Locale) =>
  (await find("pages", lang, { slug: { equals: slug } }, { limit: 1, depth: 2 }))[0] ?? null;

export const getProduct = async (slug: string, lang: Locale) =>
  (await find("products", lang, { slug: { equals: slug } }, { limit: 1, depth: 2 }))[0] ?? null;
export const getProducts = (lang: Locale, where: Where = {}) => find("products", lang, where, { sort: "order", depth: 1, limit: 500 });
export const getCategories = (lang: Locale) => find("product-categories", lang, {}, { sort: "order", limit: 200 });

export const getPost = async (slug: string, lang: Locale) =>
  (await find("posts", lang, { slug: { equals: slug } }, { limit: 1, depth: 2 }))[0] ?? null;
export const getPosts = (lang: Locale, limit = 50) => find("posts", lang, {}, { sort: "-publishedAt", limit });

export const getJob = async (slug: string, lang: Locale) =>
  (await find("jobs", lang, { slug: { equals: slug } }, { limit: 1 }))[0] ?? null;
export const getJobs = (lang: Locale) => find("jobs", lang, { open: { equals: true } }, { sort: "-createdAt" });
export const getDownloads = (lang: Locale) => find("downloads", lang, {}, { sort: "order", depth: 1 });

export const getSettings = (lang: Locale) => global("site-settings", lang);
export const getNavigation = (lang: Locale) => global("navigation", lang);

/** Everything the page-builder blocks may need, fetched once per page. */
export async function getBlockContext(lang: Locale): Promise<BlockContext> {
  const [brands, categories, products, groupCompanies, posts, jobs, downloads, settings] = await Promise.all([
    find("brands", lang, {}, { sort: "order" }),
    getCategories(lang),
    getProducts(lang),
    find("group-companies", lang, {}, { sort: "order" }),
    getPosts(lang, 12),
    getJobs(lang),
    getDownloads(lang),
    getSettings(lang),
  ]);
  return { brands, categories, products, groupCompanies, posts, jobs, downloads, settings } as unknown as BlockContext;
}
