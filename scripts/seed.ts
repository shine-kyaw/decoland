/*
  Seed the CMS with the site's current content, in English and Burmese.

    npm run seed            (needs DATABASE_URL + PAYLOAD_SECRET)

  Safe to re-run: every item is looked up by its slug/name first and updated
  rather than duplicated. It never creates users (create the first admin at
  /admin) and never touches the Inbox.

  Localised fields: each document is created in English, then updated in
  Burmese with the SAME array/block row ids, so the Burmese text lands on the
  same rows instead of replacing the structure.
*/
import fs from "node:fs";
import path from "node:path";
import { getPayload, type Payload } from "payload";
import config from "../payload.config";
import { en } from "../lib/content.en";
import { my } from "../lib/content.my";
import type { Content } from "../lib/content.en";

type Any = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

async function upsert(payload: Payload, collection: string, where: Any, enData: Any, myData?: (created: Any) => Any, draft = false) {
  const found = await payload.find({ collection: collection as never, where, limit: 1, locale: "en", depth: 0 });
  const opts = { collection: collection as never, locale: "en" as const, overrideAccess: true, context: { seed: true } };
  const status = draft ? {} : { _status: "published" };
  const doc = (found.docs[0]
    ? await payload.update({ ...opts, id: (found.docs[0] as Any).id, data: { ...enData, ...status } as never })
    : await payload.create({ ...opts, data: { ...enData, ...status } as never })) as Any;
  if (myData) {
    await payload.update({ ...opts, locale: "my", id: doc.id, data: { ...myData(doc), ...status } as never });
  }
  return doc;
}

/** Walk `created` (which has ids) and `local` (same shape, Burmese text) in step: keep ids, take Burmese strings. */
function withIds(created: unknown, local: unknown): unknown {
  if (Array.isArray(created) && Array.isArray(local)) return created.map((c, i) => withIds(c, local[i]));
  if (created && typeof created === "object" && local && typeof local === "object") {
    const out: Any = { ...(created as Any) };
    for (const [k, v] of Object.entries(local as Any)) out[k] = withIds((created as Any)[k], v);
    return out;
  }
  return local === undefined ? created : local;
}

// ── Home page: the v2 homepage, section by section ───────────────────────────
function home(t: Content): Any[] {
  const h = t.home;
  const heroImgs = ["/img/hero-campus.jpg", "/img/hero-entrance.jpg", "/img/hero-gate.jpg", "/img/warehouse.jpg"];
  const focus = ["center", "left", "right", "center"];
  return [
    {
      blockType: "heroSlider",
      slides: h.slides.map((s, i) => ({ imageSrc: heroImgs[i], tab: s.tab, kicker: s.kicker, title: s.title, text: s.text, focus: focus[i] })),
      primary: { label: h.ctaPrimary, url: "/contact#enquiry" },
      secondary: { label: h.ctaSecondary, url: "/paper" },
    },
    { blockType: "stats", heading: h.statement, items: h.proof.map((p) => ({ value: p.k, label: p.label })) },
    {
      blockType: "imageCards",
      kicker: h.pillarsKicker,
      cards: h.pillars.map((p, i) => ({
        imageSrc: ["/img/paper-printing.jpg", "/img/apolo-range.jpg", "/img/svc-custom-print.jpg"][i],
        title: p.title, text: p.text, tags: p.tags.join(", "),
        link: { label: p.cta, url: ["/paper", "/stationery", "/services"][i] },
      })),
    },
    { blockType: "categoryGrid", kicker: h.catalogueKicker, heading: h.catalogueTitle, text: h.catalogueText, division: "paper", link: { label: h.catalogueCta, url: "/paper" } },
    { blockType: "logoWall", kicker: h.brandsKicker, heading: h.brandsTitle },
    {
      blockType: "productRail", kicker: h.apoloKicker, heading: h.apoloTitle, text: h.apoloText, source: "featured",
      bannerSrc: "/img/apolo-range.jpg",
      primary: { label: h.apoloCta, url: "/stationery" }, secondary: { label: h.apoloShop, url: "https://apolostationery.com" },
    },
    {
      blockType: "facility", kicker: h.facilityKicker, heading: h.facilityTitle, text: h.facilityText,
      points: h.facilityPoints.map((p) => ({ value: p.k, label: p.label })),
      mainSrc: "/img/campus-aerial.jpg", side1Src: "/img/warehouse.jpg", side1Caption: h.slides[3].tab, side2Src: "/img/signage.jpg", side2Caption: h.slides[1].tab,
    },
    {
      blockType: "servicesGrid", kicker: h.servicesKicker, heading: h.servicesTitle, text: h.servicesText,
      items: h.services.map((s, i) => ({ imageSrc: ["/img/svc-cups.jpg", "/img/svc-custom-print.jpg", "/img/svc-packaging.jpg"][i], title: s.title, text: s.text })),
      link: { label: h.pillars[2].cta, url: "/services" },
    },
    {
      blockType: "groupStrip", kicker: h.groupKicker, heading: h.groupTitle, text: h.groupText,
      photos: [{ imageSrc: "/img/moderntech.jpg" }, { imageSrc: "/img/tbsp-team.jpg" }],
      link: { label: h.groupCta, url: "/group" },
    },
    { blockType: "visionMission", visionLabel: t.about.visionTitle, missionLabel: t.about.missionTitle, vision: t.about.vision, mission: t.about.mission },
    { blockType: "contactBand", heading: h.contactTitle, text: h.contactText, showForm: false },
  ];
}

const BRANDS = [
  ["Paper One", "paper-one"], ["Double A", "double-a"], ["Copy Bright", "copybright"], ["IK", "ik"], ["Glory", "glory"],
  ["Future Star", "future-star"], ["Sinar Plex", "sinar-plex"], ["I-Plus", "iplus"], ["Ningbo Star", "ningbo-star"], ["APOLO", "apolo"],
] as const;
const GROUP_LOGOS = ["aff-main-label", "aff-hitachielevators", "aff-decotbsp", "aff-moderntech"];

async function main() {
  const payload = await getPayload({ config });
  const log = (m: string) => payload.logger.info(`[seed] ${m}`);

  // Settings and menus
  await payload.updateGlobal({ slug: "site-settings", locale: "en", data: {
    addresses: [
      { label: en.about.hq.label, name: en.about.hq.name, address: en.about.hq.address },
      { label: en.about.showroom.label, name: en.about.showroom.name, address: en.about.showroom.address },
    ],
    alertEmails: [{ email: "marketing@decolandgroup.com" }],
  } as never });
  const s = (await payload.findGlobal({ slug: "site-settings", locale: "en", depth: 0 })) as Any;
  await payload.updateGlobal({ slug: "site-settings", locale: "my", data: withIds({ addresses: s.addresses }, {
    addresses: [
      { label: my.about.hq.label, name: my.about.hq.name, address: my.about.hq.address },
      { label: my.about.showroom.label, name: my.about.showroom.name, address: my.about.showroom.address },
    ],
  }) as never });
  const navKeys = ["about", "paper", "stationery", "services", "group", "contact"] as const;
  await payload.updateGlobal({ slug: "navigation", locale: "en", data: { header: navKeys.map((k) => ({ label: en.nav[k], url: `/${k}` })) } as never });
  const n = (await payload.findGlobal({ slug: "navigation", locale: "en", depth: 0 })) as Any;
  await payload.updateGlobal({ slug: "navigation", locale: "my", data: withIds({ header: n.header }, { header: navKeys.map((k) => ({ label: my.nav[k] })) }) as never });
  log("settings and menus");

  // Brands and group companies
  for (const [i, [name, file]] of BRANDS.entries()) {
    await upsert(payload, "brands", { name: { equals: name } }, { name, logoSrc: `/img/brands/${file}.jpg`, distributed: true, order: i * 10 });
  }
  for (const [i, c] of en.group.companies.entries()) {
    await upsert(payload, "group-companies", { name: { equals: c.title } },
      { name: c.title, summary: c.text, logoSrc: `/img/group/${GROUP_LOGOS[i]}.png`, order: i * 10 },
      () => ({ summary: my.group.companies[i].text }));
  }
  log("brands and group companies");

  // Post categories + migrated WordPress posts (all CSR)
  const cats: Record<string, Any> = {};
  for (const [slug, t, tm] of [["news", "News", "သတင်း"], ["csr", "CSR", "လူမှုရေး ဆောင်ရွက်ချက်များ"], ["events", "Events", "ပွဲများ"]] as const) {
    cats[slug] = await upsert(payload, "post-categories", { slug: { equals: slug } }, { title: t, slug }, () => ({ title: tm }));
  }
  const wpPosts = JSON.parse(fs.readFileSync(path.join(root, "data/wp-posts.json"), "utf8").replace(/^﻿/, "")) as Any[];
  // Only the free-clinic post has real photos (May 2020 set); the others keep no cover.
  const photosFor = (slug: string) => (/piti|clinic|clanic/i.test(slug) ? [1, 2, 3, 4, 5].map((n) => `/img/csr/csr-${n}.jpg`) : []);
  for (const p of wpPosts) {
    const text = String(p.content).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&#8217;/g, "'").replace(/\s+/g, " ").trim();
    const paragraphs = text ? [text] : [];
    await upsert(payload, "posts", { slug: { equals: p.slug } }, {
      title: String(p.title).replace(/&#8217;/g, "'"),
      slug: p.slug,
      category: cats.csr.id,
      publishedAt: new Date(p.date).toISOString(),
      coverSrc: photosFor(p.slug)[0],
      gallery: photosFor(p.slug).slice(1).map((imageSrc) => ({ imageSrc })),
      excerpt: text.slice(0, 200),
      body: lexical(paragraphs),
    });
  }
  log(`${wpPosts.length} posts`);

  // Catalogue (written by the catalogue transcription step; optional)
  const catFile = path.join(root, "data/catalogue.json");
  if (fs.existsSync(catFile)) {
    const cat = JSON.parse(fs.readFileSync(catFile, "utf8")) as { categories: Any[]; products: Any[] };
    // Category cards on the home page use the old site's paper photography.
    const catImg: Record<string, string> = {
      "copy-paper": "/img/brands/paper-one.jpg", "printing-papers": "/img/paper-printing.jpg", "packaging-papers": "/img/paper-packaging.jpg",
      "special-papers": "/img/paper-special.jpg", "stationery-papers": "/img/paper-stationery.jpg", books: "/img/apolo-range.jpg",
      "paper-cups-bowls": "/img/svc-cups.jpg", "commercial-printing": "/img/svc-custom-print.jpg", "custom-packaging": "/img/svc-packaging.jpg",
    };
    const catIds: Record<string, string | number> = {};
    for (const c of cat.categories) {
      const d = await upsert(payload, "product-categories", { slug: { equals: c.slug } }, { title: c.title, slug: c.slug, division: c.division, order: c.order ?? 100, description: c.description, imageSrc: catImg[c.slug] });
      catIds[c.slug] = d.id;
    }
    const brands = await payload.find({ collection: "brands", limit: 100, depth: 0 });
    const brandId = (name?: string | null) => brands.docs.find((b) => (b as Any).name?.toLowerCase() === name?.toLowerCase())?.id;
    for (const p of cat.products) {
      await upsert(payload, "products", { slug: { equals: p.slug } }, {
        title: p.title, slug: p.slug, category: catIds[p.category], brand: brandId(p.brand), summary: p.summary,
        specs: (p.specs ?? []).map((sp: Any) => ({ label: sp.label, value: sp.value })),
        images: (p.images ?? []).map((f: string) => ({ imageSrc: `/img/catalogue/${f.replace(/\.png$/i, ".jpg")}` })),
        featured: Boolean(p.featured), order: p.order ?? 100,
      });
    }
    log(`${cat.categories.length} categories, ${cat.products.length} products`);
  } else {
    log("no data/catalogue.json yet — catalogue skipped");
  }

  // Home page
  const homeEn = home(en);
  await upsert(payload, "pages", { slug: { equals: "home" } }, { title: "Home", slug: "home", layout: homeEn },
    (created) => ({ title: "ပင်မစာမျက်နှာ", layout: withIds(created.layout, home(my)) }));
  log("home page");

  process.exit(0);
}

/** Minimal Lexical document from plain paragraphs. */
function lexical(paragraphs: string[]) {
  return {
    root: {
      type: "root", version: 1, format: "", indent: 0, direction: "ltr",
      children: paragraphs.map((t) => ({
        type: "paragraph", version: 1, format: "", indent: 0, direction: "ltr", textFormat: 0,
        children: [{ type: "text", version: 1, text: t, format: 0, detail: 0, mode: "normal", style: "" }],
      })),
    },
  };
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
