import type { MetadataRoute } from "next";
import { LOCALES, PAGES, SITE_URL, hrefFor } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE_URL}${hrefFor("en", p)}`,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${hrefFor(l, p)}`])) },
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
