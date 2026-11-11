# Going live: switch-on checklist

The code is ready. Going live is mostly settings in the Vercel dashboard, and the order matters. Nothing below changes the current live site until step 3.

## 1. Vercel Pro (before or with the domain)
Vercel → Team settings → Billing → upgrade to **Pro**. Vercel's Hobby plan is for non-commercial use only, so a company website needs Pro (about $20 a month). Upgrading on its own changes nothing in the site.

## 2. Database (Neon, through Vercel)
1. Vercel → **decoland** project → **Storage** → **Create Database** → **Neon** (Serverless Postgres).
2. Choose the **Singapore** region (closest to Yangon) and the free plan. The free plan's 0.5 GB is enough: all the built-in photos stay as files, so only uploads go into the database.
3. Connect it to the **decoland** project for **all environments**. This sets `DATABASE_URL` automatically.

## 3. The CMS secret, then redeploy
1. Vercel → decoland → Settings → **Environment Variables** → add `PAYLOAD_SECRET`. Its value is in `D:\Aster\Decoland\.env.production.local` (git-ignored); delete that file once the value is pasted. Never change this value later: it signs every login.
2. Deployments → latest → **Redeploy**.
   The build log shows `[cms] Applying database migrations…`, then `[seed] … 117 products … 6 inner pages … done`. This takes about 3 extra minutes, once only.

## 4. Create the first admin, straight away
Open **decoland-two.vercel.app/admin**. With no accounts yet, it asks for the first user, and **whoever gets there first becomes the administrator**, so do this immediately after the deploy finishes. Then go to **Users** and add Deco-Land's staff with the right roles (Administrator, Editor or Sales).

## 5. Alerts (optional; can come later)
Add any of these in Environment Variables, then redeploy. Each channel switches on by itself once its variables are set.

| Channel | Variables | Where to get them |
|---|---|---|
| Email | `RESEND_API_KEY`, `ALERT_FROM_EMAIL` (e.g. `Deco-Land Website <enquiries@decolandgroup.com>`) | resend.com → add the domain decolandgroup.com → add its DNS records at Hostinger. These don't touch the Google Workspace mail records. |
| DingTalk | `DINGTALK_WEBHOOK`, `DINGTALK_SECRET` | In the sales DingTalk group: Settings → Bots → Add → Custom bot → Security: **Signature** (sign). Copy the webhook URL and the SEC… secret. |
| Telegram | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Create a bot with @BotFather to get the token. Add the bot to the sales group and send one message; the group's chat id (a negative number) then appears at `api.telegram.org/bot<token>/getUpdates`. |

Recipients for alert emails are set in the admin under Settings → Site settings → Alert emails.

## 6. Domain cutover (last)
1. Vercel → decoland → Settings → **Domains** → add `decolandgroup.com` and `www.decolandgroup.com`. Vercel shows the exact DNS records to use.
2. At Hostinger → DNS for decolandgroup.com, change **only** the `@` A record and the `www` record to Vercel's values.
   **Do not touch the MX, TXT/SPF or Google records**, or company email stops.
3. Wait for Vercel to show the domain as **Valid** and issue the certificate (minutes to a few hours).
4. Set `NEXT_PUBLIC_SITE_URL=https://decolandgroup.com` (already the default) and redeploy.
5. Then: cancel the WordPress hosting, or at least take it offline. It is compromised (spam links in the footer and suspicious plugins).

## Checks after go-live
- Submit a test enquiry. It should appear in Inbox → Enquiries, with an email, DingTalk and Telegram alert if those are set.
- Apply to a test job with a small PDF CV. Open it from Inbox → Job applications. **This is the one feature not yet tested on a real database.**
- Edit a sentence on the home page and publish. It should show on the site within seconds.
- Both `/en` and `/my` load, and `/admin` shows the WordPress-style dashboard.
