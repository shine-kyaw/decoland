# Going live: switch-on checklist

The code is ready. Going live is mostly settings in the Vercel dashboard, and the order matters. Nothing below changes the current live site until step 3.

**Ownership (decided 11 Nov 2026):** Deco-Land owns every account that holds their data or bills them: the Vercel team, the database, the email service and the domain. Aster is invited as a member. The code stays in Aster's GitHub.

## 0. Deco-Land's accounts (Deco-Land does this)
1. Deco-Land signs up at vercel.com with a **company role email they control**, for example `it@decolandgroup.com`. Not one employee's personal address.
2. They create a **team** called "Deco-Land" on the **Pro** plan, paid by company card. Hobby is for non-commercial use only.
3. They invite Shine (Aster) as **Owner** or Member.
4. Aster then transfers the `decoland` project into that team: Project → Settings → Advanced → **Transfer Project**. The URL and history move with it. Re-check the Git connection to `shine-kyaw/decoland` afterwards.

## 1. Vercel Pro
Done in step 0. Everything below happens inside **Deco-Land's team**, not Aster's account.

## 2. Database (Neon, through Vercel, owned by Deco-Land's team)
1. Vercel → **decoland** project → **Storage** → **Create Database** → **Neon** (Serverless Postgres).
2. Choose the **Singapore** region (closest to Yangon) and a **paid plan**, for its days-long restore history. A nightly encrypted backup runs on top of that. Set it up with the Blob store, `BACKUP_KEY` and `CRON_SECRET`, following `docs/BACKUP.md` → "Setting it up". **Save `BACKUP_KEY` in Deco-Land's password manager before deleting `.env.production.local`.**
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
- Vercel → Settings → Cron Jobs → **Run** the backup once. The dashboard's Backups panel should turn green and show the time.
