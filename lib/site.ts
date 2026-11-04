export const LOCALES = ["en", "my"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://decolandgroup.com").replace(/\/+$/, "");
export const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false";

/*
  Facts the client has confirmed or published. Anything not here is not
  stated on the site. See memory: project-decoland-website.
*/
export const CONTACT = {
  phoneDisplay: "+95 9 777 271999",
  phoneTel: "+959777271999",
  viber: "viber://chat?number=%2B959777271999",
  email: "marketing@decolandgroup.com",
  messenger: "https://m.me/apolostio",
  // The Messenger channel is the APOLO brand page, not a Deco-Land corporate page.
  facebook: "https://www.facebook.com/apolostio",
  hotlineOld: "09-777-097-999",
};

// Where the APOLO shop lives. Linked, never rebuilt here.
export const APOLO_URL = "https://apolostationery.com";

export const PAGES = ["", "about", "paper", "stationery", "services", "group", "contact"] as const;
export type PageKey = (typeof PAGES)[number];

export const hrefFor = (lang: Locale, path: string) => `/${lang}${path ? `/${path}` : ""}`;
