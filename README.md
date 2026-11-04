# Deco-Land website (decolandgroup.com)

Showcase site for Deco-Land Group, in English (`/en`) and Burmese (`/my`). Next.js 16 with no CMS and no prices. The APOLO shop is linked out to, not rebuilt here.

## Run locally (Node is not on PATH on this box)

```bash
export PATH="/c/Users/user/tools/node-v24.19.0-win-x64:$PATH"
npm run build && npm start   # http://localhost:3000
```

## Where things live

- `lib/content.en.ts` holds all English copy, and `lib/content.my.ts` holds the Burmese draft with the same shape.
- `lib/site.ts` holds confirmed contact details, the APOLO link and the placeholder switch.
- `app/[lang]/…` contains the pages: home, about, paper, stationery, services, group and contact.
- `app/api/enquiry/route.ts` sends the enquiry form through Resend. It returns 503 "unconfigured" until `RESEND_API_KEY` is set.
- `next.config.ts` contains the 301 redirects from the old WordPress URLs.
- `_source-photos/` (git-ignored) has old-site images that are deliberately not published: client-branded cups, stock press renders and banners with baked-in text.

## Env (see `.env.example`)

`RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SHOW_PLACEHOLDERS`

## Before launch

- [ ] Burmese copy proofread by Deco-Land's staff. It is machine-drafted, especially the print-trade terms.
- [ ] Vector logo. The current mark is a 512 px PNG from the old site.
- [ ] Real product, paper-stock and showroom photography.
- [ ] Opening hours, milestones from 2018 onward, and service specs (MOQ, lead times, sizes).
- [ ] Confirm `APOLO_URL` (the old site links apolostationery.com).
- [ ] Confirm the Main Label partner name. The old site says both SHIDO and SMIC.
- [ ] Resend domain verified and `RESEND_API_KEY` set. Then set `NEXT_PUBLIC_SHOW_PLACEHOLDERS=false`.
- [ ] DNS access for the cutover; keep the MX records. Clean the hacked footer on the old WordPress site now.
