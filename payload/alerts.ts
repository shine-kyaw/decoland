import crypto from "node:crypto";
import type { Payload } from "payload";

/*
  New enquiry / job application alerts. Every channel is optional and they
  all run in parallel; one failing never stops the others, and the record is
  already saved in the admin inbox before any of this runs.

  Env:
    RESEND_API_KEY, ALERT_FROM_EMAIL     email (recipients from Site Settings, else marketing@)
    DINGTALK_WEBHOOK, DINGTALK_SECRET    DingTalk group robot (secret optional, for signed robots)
    TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID Telegram bot posting into a group
    NEXT_PUBLIC_SITE_URL                 for the "open in admin" link
*/

type Kind = "enquiry" | "application";
type Doc = Record<string, unknown> & { id: string | number };

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://decolandgroup.com").replace(/\/+$/, "");

function lines(kind: Kind, d: Doc): { title: string; rows: Array<[string, string]>; link: string } {
  const s = (v: unknown) => (v == null || v === "" ? "—" : String(v));
  if (kind === "application") {
    return {
      title: `New job application: ${s(d.name)}`,
      rows: [["Name", s(d.name)], ["Phone", s(d.phone)], ["Email", s(d.email)], ["Message", s(d.message).slice(0, 400)]],
      link: `${SITE}/admin/collections/applications/${d.id}`,
    };
  }
  return {
    title: `New enquiry: ${s(d.name)}${d.company ? `, ${d.company}` : ""}`,
    rows: [
      ["Name", s(d.name)],
      ["Business", s(d.company)],
      ["Phone", `${s(d.phone)}${d.viberOk ? " (Viber OK)" : ""}`],
      ["Email", s(d.email)],
      ["Customer", s(d.customerType)],
      ["About", s(d.topic)],
      ["Message", s(d.message).slice(0, 600)],
    ],
    link: `${SITE}/admin/collections/enquiries/${d.id}`,
  };
}

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const timeout = () => AbortSignal.timeout(8000);

async function email(to: string[], m: ReturnType<typeof lines>, replyTo?: string) {
  const html = `<div style="font-family:system-ui,sans-serif;max-width:620px;color:#121614">
<h2 style="margin:0 0 14px;font-size:18px">${esc(m.title)}</h2>
<table style="border-collapse:collapse;font-size:14px">${m.rows
    .map(([k, v]) => `<tr><td style="padding:5px 16px 5px 0;color:#5b635e;vertical-align:top">${k}</td><td style="padding:5px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="margin-top:18px"><a href="${m.link}" style="color:#00803d">Open in the website admin</a></p></div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ALERT_FROM_EMAIL || "Deco-Land Website <enquiries@decolandgroup.com>",
      to,
      reply_to: replyTo,
      subject: m.title,
      text: [...m.rows.map(([k, v]) => `${k}: ${v}`), "", m.link].join("\n"),
      html,
    }),
    signal: timeout(),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function dingtalk(m: ReturnType<typeof lines>) {
  let url = process.env.DINGTALK_WEBHOOK!;
  if (process.env.DINGTALK_SECRET) {
    // Signed robots: HMAC-SHA256 of "timestamp\nsecret", base64, URL-encoded.
    const ts = Date.now();
    const sign = crypto.createHmac("sha256", process.env.DINGTALK_SECRET).update(`${ts}\n${process.env.DINGTALK_SECRET}`).digest("base64");
    url += `${url.includes("?") ? "&" : "?"}timestamp=${ts}&sign=${encodeURIComponent(sign)}`;
  }
  const text = [`### ${m.title}`, ...m.rows.map(([k, v]) => `- **${k}:** ${v}`), "", `[Open in admin](${m.link})`].join("\n");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msgtype: "markdown", markdown: { title: m.title, text } }),
    signal: timeout(),
  });
  const body = (await res.json().catch(() => ({}))) as { errcode?: number; errmsg?: string };
  if (!res.ok || (body.errcode && body.errcode !== 0)) throw new Error(`DingTalk ${res.status}: ${body.errmsg ?? ""}`);
}

async function telegram(m: ReturnType<typeof lines>) {
  const text = [`<b>${esc(m.title)}</b>`, ...m.rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`), "", `<a href="${m.link}">Open in admin</a>`].join("\n");
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
    signal: timeout(),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}

export async function sendAlerts(kind: Kind, doc: Doc, payload: Payload): Promise<void> {
  const m = lines(kind, doc);
  let to = ["marketing@decolandgroup.com"];
  try {
    const settings = (await payload.findGlobal({ slug: "site-settings", depth: 0 })) as { alertEmails?: Array<{ email?: string }> };
    const list = (settings.alertEmails ?? []).map((r) => r.email).filter(Boolean) as string[];
    if (list.length) to = list;
  } catch {
    /* settings not created yet: keep the default */
  }

  const jobs: Array<[string, () => Promise<void>]> = [];
  if (process.env.RESEND_API_KEY) jobs.push(["email", () => email(to, m, typeof doc.email === "string" && doc.email ? doc.email : undefined)]);
  if (process.env.DINGTALK_WEBHOOK) jobs.push(["dingtalk", () => dingtalk(m)]);
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) jobs.push(["telegram", () => telegram(m)]);
  if (!jobs.length) {
    payload.logger.warn(`[alerts] no alert channel configured; ${kind} ${doc.id} is in the admin inbox only`);
    return;
  }
  const results = await Promise.allSettled(jobs.map(([, run]) => run()));
  results.forEach((r, i) => {
    if (r.status === "rejected") payload.logger.error(`[alerts] ${jobs[i][0]} failed for ${kind} ${doc.id}: ${String(r.reason)}`);
  });
}
