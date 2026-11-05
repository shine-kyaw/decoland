# Deco-Land CMS: build plan

This plan replaces the WordPress admin at decolandgroup.com/wp-admin. Shine's decisions are dated 2026-11-04.

## Stack
- Next 16.4.4 with Payload **3.92.1**, both in this repo. The admin lives at `/admin` and the REST API at `/api`.
- The database is Postgres: Neon in production, and PGlite for local tests (see the KTK notes).
- Media is stored in Postgres by default (`payload/postgresStorage.ts`, copied from KTK). There is an optional S3/R2 switch.
- Built-in photos stay in `/public/img`. Image fields have a `<name>Src` fallback, the same pattern as KTK's `imageField`.
- **The CMS is on only when `DATABASE_URL` is set.** Without it the public site builds and serves the static content in `lib/content.*.ts` exactly as it does today, so nothing breaks while Neon is being set up.

## Admin: styled like WordPress
- Sidebar groups, in order:
  - **Dashboard**
  - **Content:** Pages, Posts (News & CSR), Post Categories
  - **Catalogue:** Products, Product Categories, Brands
  - **Company:** Group Companies, Jobs, Downloads
  - **Inbox:** Enquiries, Job Applications
  - **Media**
  - **Settings:** Site Settings global, Navigation global
  - **Users**
- Dark WordPress-style sidebar (#1d2327, hover #2c3338, current item in Deco green #00a850), white content area, light grey page background (#f0f0f1), list tables and buttons in a WordPress style, with the Publish panel on the right.
- The Dashboard copies WordPress's "At a glance" (counts), plus Recent enquiries (newest 5 with status), Quick links (New page, New product, New post, Media) and a Site visits widget (Phase 2).
- The admin interface is in **English only**. Content fields that are localised show EN and MY.

## Roles
- **admin:** everything.
- **editor:** all content, catalogue, company and media, with read access to the inbox.
- **sales:** read and update on Enquiries and Applications only (status, notes, assignee).

## Collections
| Slug | Group | Notes |
|---|---|---|
| `pages` | Content | title, slug, `layout` (blocks), SEO. Drafts, versions, scheduled publishing. `home` is the home page. |
| `posts` | Content | title, slug, category, publishedAt, cover, excerpt, body (rich text), gallery, SEO. Drafts and scheduling. |
| `post-categories` | Content | News, CSR, Events |
| `products` | Catalogue | title, slug, category, brand, images[], summary, specs[] {label, value} such as GSM, Size, Pages and Pack, description, featured, order, SEO. Drafts. No prices. |
| `product-categories` | Catalogue | title, slug, division (paper, stationery or services), image, description, order |
| `brands` | Catalogue | name, logo, distributed (bool), order |
| `group-companies` | Company | name, logo, summary, photo, website, order |
| `jobs` | Company | title, slug, department, location, type, description, open (bool), closingDate |
| `downloads` | Company | title, file, category (profile, catalogue or certificate), cover, order |
| `enquiries` | Inbox | name, company, phone, email, viberOk, customerType, topic, product (rel), message, sourcePage, lang. **status** (new, contacted, quoted or closed), assignedTo (rel users), notes[]. Created by the public form only. |
| `applications` | Inbox | job (rel), name, phone, email, cv (upload), message, status |
| `media` | Media | alt (localised), caption |
| `users` | Users | name, role |

Fields marked localised (`localized: true`) are titles, text, alt text and SEO. Slugs, specs values and numbers are not.

## Globals
- `site-settings`: company name, phones, emails, Viber, Messenger, addresses (HQ and showroom, localised), opening hours, social links, the APOLO shop URL, and alert settings: alert email list plus the on/off switches for DingTalk and Telegram. The webhook secrets stay in env.
- `navigation`: header links and footer columns, as localised labels.

## Blocks (the page builder)
Each block maps to a designed section that already exists in `app/(frontend)/[lang]/page.tsx` and `globals.css`.

| Block | Section it renders |
|---|---|
| `heroSlider` | slides with image, tab, kicker, title, text and CTAs |
| `stats` | heading and items {value, label} (the statement band) |
| `imageCards` | kicker and cards {image, title, text, tags, link} (the pillars) |
| `categoryGrid` | product categories (auto, or picked) |
| `logoWall` | brands (auto from `brands`) |
| `productRail` | featured products, or a chosen category, with intro and buttons |
| `facility` | heading, text, points, a main image and two side images |
| `servicesGrid` | heading and cards |
| `groupStrip` | auto from `group-companies`, plus photos |
| `visionMission` | the vision and mission pair |
| `contactBand` | heading, text and the channels from settings |
| `textImage` | rich text with an image left or right |
| `richText` | rich text only |
| `gallery` | images |
| `cta` | heading, text and button |
| `postsList` | latest posts, optionally by category |
| `jobsList` | open jobs |
| `downloadsList` | downloads |
| `productGrid` | filterable products in a category |

## Enquiry alerts (`afterChange` on create)
1. **Email:** Resend to the settings list, defaulting to marketing@decolandgroup.com.
2. **DingTalk:** a group robot webhook (`DINGTALK_WEBHOOK`, with optional `DINGTALK_SECRET` for signed requests).
3. **Telegram:** a bot (`TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`).

Every channel is optional and they all run in parallel. If one channel fails, the others still go out. The enquiry is always saved first.

## Public site
- The routes are `app/(frontend)/[lang]/…`: home, about, paper, stationery, services, group, contact, plus the new products/[slug], news, news/[slug], careers, careers/[slug] and downloads. `/search` is Phase 2.
- Pages read from Payload when it's on and fall back to the static content when it's off.
- Messenger and Viber get a floating chat button.

## Phases
- **Phase 1:** core, schema, WordPress-style admin, block rendering, alerts, migration of WP content and the catalogue.
- **Phase 2:** careers pages, downloads pages, search, the analytics widget, and a training guide for Deco-Land staff.
