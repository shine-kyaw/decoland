/*
  POST /api/enquiry — emails the Deco-Land sales inbox via Resend.

  Env (Vercel → Settings → Environment Variables):
    RESEND_API_KEY      required; without it the endpoint answers 503
                        "unconfigured" so the form can say so honestly
                        instead of pretending the message was sent.
    ENQUIRY_TO_EMAIL    comma-separated recipients
                        (default marketing@decolandgroup.com)
    ENQUIRY_FROM_EMAIL  sender on a Resend-verified domain
*/

const TO = (process.env.ENQUIRY_TO_EMAIL || "marketing@decolandgroup.com")
  .split(",").map((s) => s.trim()).filter(Boolean);
const FROM = process.env.ENQUIRY_FROM_EMAIL || "Deco-Land Website <enquiries@decolandgroup.com>";

const LIMITS = { name: 120, company: 160, phone: 40, email: 200, who: 80, about: 80, message: 5000 } as const;
type Field = keyof typeof LIMITS;

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const json = (status: number, body: unknown) => Response.json(body, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "Bad request." });
  }

  // Honeypot filled → pretend success so bots learn nothing.
  if (typeof body.website === "string" && body.website.trim()) return json(200, { ok: true });

  const f = {} as Record<Field, string>;
  for (const key of Object.keys(LIMITS) as Field[]) {
    f[key] = String(body[key] ?? "").trim().slice(0, LIMITS[key]);
  }
  const viber = body.viber === true;
  const lang = body.lang === "my" ? "Burmese" : "English";

  if (!f.name || !f.phone || !f.message) return json(400, { ok: false, error: "Missing required fields." });
  if (!/^[+\d][\d\s()-]{5,}$/.test(f.phone)) return json(400, { ok: false, error: "Phone number looks wrong." });
  if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return json(400, { ok: false, error: "Email looks wrong." });

  if (!process.env.RESEND_API_KEY) {
    console.error("[enquiry] RESEND_API_KEY is not set");
    return json(503, { ok: false, reason: "unconfigured" });
  }

  const rows: Array<[string, string]> = [
    ["Name", f.name],
    ["Business", f.company || "—"],
    ["Phone", `${f.phone}${viber ? " (Viber OK)" : ""}`],
    ["Email", f.email || "—"],
    ["Customer type", f.who || "—"],
    ["Asking about", f.about || "—"],
    ["Site language", lang],
  ];
  const subject = `Website enquiry — ${f.name}${f.company ? `, ${f.company}` : ""}`;
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", f.message].join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;max-width:620px;color:#15181a">
<p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#585d58;margin:0 0 8px">decolandgroup.com enquiry</p>
<table style="border-collapse:collapse;font-size:14px;margin-bottom:20px">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#585d58">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`)
    .join("")}</table>
<div style="border-left:3px solid #00a850;padding:4px 0 4px 16px;white-space:pre-wrap;line-height:1.6">${esc(f.message)}</div></div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: TO, reply_to: f.email || undefined, subject, text, html }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error("[enquiry] delivery failed:", err);
    return json(502, { ok: false, reason: "delivery-failed" });
  }
  return json(200, { ok: true });
}
