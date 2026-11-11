# Deco-Land website: what was built

Rebuild of decolandgroup.com, replacing the WordPress/Enfold site. Repo `shine-kyaw/decoland`, deployed on Vercel from `main`.
Seven commits, from 4 to 11 November 2026.

---

## 1. Showcase site, v1 (07ca93b, 4 Nov)

The first version was a bilingual static site. It was later restyled (v2, below), but its structure and content files are still the foundation.

- **Languages:** English and Burmese at `/en/...` and `/my/...`. All words live in `lib/content.en.ts` and `lib/content.my.ts`, never in the page code. The Burmese is machine-drafted and needs proofreading by Deco-Land.
- **Pages:** Home, About, Paper, Stationery (APOLO), Services, Group and Contact, plus a 404.
- **Enquiry form** (`components/EnquiryForm.tsx` → `app/api/enquiry`). It has:
  - Name, business, phone, email, customer type, topic and message.
  - A "Viber OK" tick.
  - A hidden honeypot field that catches bots.
  - Server-side checks on length, phone format and email format.
  - An honest "not connected yet" message (HTTP 503) instead of a fake "sent".
- **SEO basics:** sitemap, robots.txt, canonical and hreflang links (`app/sitemap.ts`, `app/robots.ts`, `lib/site.ts`).
- **Placeholders:** facts we don't have yet show as visible "client to supply" notes (`components/Placeholder.tsx`). They are never invented.
- **Fix (77de7d1):** `vercel.json` pins the framework to Next.js. Vercel had detected "Other" on the empty repo, so every route returned 404.

## 2. Homepage v2: the old site's bones, premium finish (72a3bd4, 4 Nov)

Replaces v1's minimal look, which was rejected.

- **Hero slider** (`components/HeroSlider.tsx`): full-width real campus photos (aerial, entrance, gate, warehouse) with tabs. It autoplays, pauses on hover, and respects reduced-motion settings.
- **Old site's sections, kept in order and restyled:** company intro with figures (1997, 25,000 m², 200+ staff), paper / APOLO / services cards, the facility band, brand logos, group companies and the contact band.
- **Real photography:** about 50 real photos from the old WordPress media library went into `public/img/` (hero, campus, paper, services, brands, group, APOLO, catalogue, CSR). The full 309-item library is kept in `_source-photos/`, which is not in git.
- `app/globals.css` was largely rewritten for the v2 design. The v1 fold-cup animation was removed.

## 3. The CMS: a WordPress-style admin (024f298, 5 Nov)

Payload CMS 3.92 inside the same Next.js 16 app, at `/admin`. It is **off until a database is connected**: without `DATABASE_URL` the site serves its built-in content and `/admin` shows a setup screen (`components/admin/CmsSetup.tsx`).

**Admin look and feel** (`app/(payload)/custom.scss`, `components/admin/*`)
- Dark grouped sidebar like WordPress: Content, Catalogue, Company, Inbox, Media, Settings, Users.
- WordPress-style dashboard (`Dashboard.tsx`): at-a-glance counts, new enquiries by status, recent changes and quick links.
- Deco-Land logo and icon on the login screen and in the sidebar.
- `KeepNavOpen.tsx` stops Payload from collapsing the sidebar on laptop-sized screens.

**Content** (`payload/collections/*`, `payload/globals.ts`)
- **Pages:** built from pre-designed sections (blocks), with drag to reorder, duplicate and remove.
- **News & CSR posts** and **Post categories**.
- **Products** (no prices): photos, label/value specifications, category, featured flag, order and an SEO panel. **Product categories** and **Brands** too.
- **Group companies, Jobs, Downloads.**
- **Media library** for photos and PDFs. Files are stored inside the database (`payload/postgresStorage.ts`, table `deco_media_blobs`), so no separate file host is needed.
- **Site settings:** phone, Viber, email, Messenger, addresses, opening hours and alert emails. **Menus:** header and footer.
- **English and Burmese** on every text field. An empty Burmese field falls back to English.
- **Drafts, autosave, version history with restore, and scheduled publishing** on pages, posts and products.
- **Per-page SEO:** title, description and share image (`@payloadcms/plugin-seo`).

**Sections editors can add**
- 19 section types in this commit (`payload/blocks/index.ts`, `components/blocks/*`): hero slider, headline and figures, image cards, product categories, product showcase, product grid, brand logos, facility band, services, text and image, gallery, group strip, latest news, open jobs, downloads list, contact band, call to action, vision/mission and rich text.
- Every photo slot is an upload plus a built-in fallback image, so pages never show a hole (`payload/fields.ts`, `lib/media.ts`).

**Inbox and alerts** (`payload/collections/inbox.ts`, `payload/alerts.ts`)
- **Enquiries** have a status (New, Contacted, Quoted, Closed), an assignee, internal notes, the linked product, the source page and the language used.
- On each new enquiry, alerts go out in parallel to email (Resend), a DingTalk group robot (signed) and a Telegram group. Each channel is optional and switches on when its keys are set. One channel failing doesn't stop the others or lose the enquiry.

**Users and roles** (`payload/collections/Users.ts`, `payload/access.ts`)
- **Administrator** can do everything. **Editor** works on content, the catalogue and media. **Sales** sees the Inbox only.
- The public can read published content only. Drafts, the inbox and private files are for staff only.

**New public pages**
- `/products` and `/products/[slug]`. Each product page has an "Enquire about this product" button that pre-fills the form, so the enquiry arrives already naming the product.
- `/news` and `/news/[slug]`.
- `/[slug]` for any new page an editor creates.

**Speed:** CMS reads are cached and cleared the moment an editor publishes (`lib/cms.ts`, `payload/revalidate.ts`), so pages stay fast and changes still appear within seconds.

**Content migration** (`scripts/seed.ts`, `data/*`)
- Site settings, menus, brands, group companies and the 4 real WordPress posts.
- A **117-product catalogue in 15 categories**, built from the old site's product images (`data/catalogue.json`). `data/catalogue-REVIEW.md` lists 21 items Deco-Land should check.

The database schema is versioned in `migrations/`.

## 4. Every page editable (22e20a4, 6 Nov)

- About, Paper, Stationery, Services, Group and Contact became CMS pages too, not just Home. The seed builds them from the same content files, in both languages (`scripts/pages.ts`).
- 7 new section types (26 in total): page header, timeline, numbered steps, places (addresses and map), category details with products, group company cards, and contact options with form.
- Services cards gained bullet lists.
- The v2 design was carried through to the inner pages.
- Migration `20261106_001659_inner_page_blocks`.

## 5. Phase 2 features (845e4c8, 6 Nov)

- **Careers:** `/careers` lists open jobs and `/careers/[slug]` shows the details with an apply form (`components/ApplyForm.tsx` → `app/api/apply`).
  - The CV can be PDF, Word, JPG or PNG, up to 4 MB, because Vercel rejects requests over about 4.5 MB.
  - The file type is checked against the extension, and the file is renamed safely.
  - CVs go into a staff-only file store. Applications land in Inbox → Job applications and trigger the same alerts.
- **Search:** `/search` covers products, news and pages in the visitor's language. There's a search icon in the header and a search box in the mobile menu.
- **Downloads:** `/downloads` lists the company profile, catalogues and certificates uploaded in the admin.
- **Chat button** (`components/ChatButton.tsx`): a floating Viber / Messenger / phone button on every page.
- **Visits counter** (`lib/analytics.ts`, `app/api/track`, `components/PageViewBeacon.tsx`):
  - No cookies and no personal data: only the day, the page and a count.
  - Bots are filtered out, and days are counted in Yangon time.
  - Shown on the admin dashboard as today, the last 7 days and the top pages.
- **Staff guide:** `docs/ADMIN-GUIDE.md`, a plain-English manual for Deco-Land's team.
- **Bug fix:** the forms sent the product and job IDs as text, but the database expects numbers. Enquiries and applications were being saved without their link to the product or job. Both now convert the ID first.

## 6. Go-live automation (11 Nov)

- `scripts/migrate-if-configured.mjs` runs before every build (`package.json` → `build`):
  - **No database configured:** it does nothing, and the site builds with its built-in content as before.
  - **Database configured:** it applies the schema migrations, then fills the database with the website content.
- The fill runs **once only**. It records that it ran in a `deco_cms_meta` table and skips on every later deploy, so a deploy can never overwrite what editors changed. `npm run seed -- --force` fills it again on purpose.
- This was tested on an empty database: the first run created all the tables and loaded 117 products, 7 pages and 4 posts in about 2½ minutes. The second run skipped the fill.
- `docs/GO-LIVE.md` is the step-by-step switch-on checklist.
