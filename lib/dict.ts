import type { Metadata } from "next";
import { en, type Content } from "./content.en";
import { my } from "./content.my";
import { LOCALES, SITE_URL, type Locale, hrefFor } from "./site";

const dicts: Record<Locale, Content> = { en, my };
export const getContent = (lang: Locale): Content => dicts[lang];

/** Page metadata with canonical + hreflang alternates for both languages. */
export function pageMeta(lang: Locale, key: keyof Content["meta"], path: string): Metadata {
  const m = dicts[lang].meta[key];
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}${hrefFor(l, path)}`;
  languages["x-default"] = `${SITE_URL}${hrefFor("en", path)}`;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `${SITE_URL}${hrefFor(lang, path)}`, languages },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${SITE_URL}${hrefFor(lang, path)}`,
      siteName: "Deco-Land",
      locale: lang === "my" ? "my_MM" : "en_US",
      type: "website",
      images: [{ url: "/photos/Deco_Land_Paper_Stationery.jpg", width: 1600, height: 504 }],
    },
  };
}
