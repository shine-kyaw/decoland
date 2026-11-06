/*
  POST /api/apply — the public job application form (multipart).

  Saves the CV to the staff-only "private-files" collection and the application
  to Inbox → Job Applications; that save fires the alerts hook
  (payload/alerts.ts). Needs the CMS (DATABASE_URL): without it the endpoint
  answers 503 "unconfigured" so the form can say so honestly.
*/

import { getCms, isCmsEnabled } from "@/lib/payload";

export const runtime = "nodejs";

// 4 MB: Vercel rejects request bodies over ~4.5 MB before this code runs.
const MAX_BYTES = 4 * 1024 * 1024;
const LIMITS = { name: 120, phone: 40, email: 200, message: 5000 } as const;
const TYPES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
};

const json = (status: number, body: unknown) => Response.json(body, { status });
const text = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Form fields arrive as text; Postgres ids are numbers.
const relId = (v: string) => (/^\d+$/.test(v) ? Number(v) : undefined);

export async function POST(req: Request) {
  if (!isCmsEnabled()) return json(503, { ok: false, reason: "unconfigured" });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json(400, { ok: false, error: "Bad request." });
  }

  // Honeypot filled → pretend success so bots learn nothing.
  if (text(form.get("website"), 200)) return json(200, { ok: true });

  const name = text(form.get("name"), LIMITS.name);
  const phone = text(form.get("phone"), LIMITS.phone);
  const email = text(form.get("email"), LIMITS.email);
  const message = text(form.get("message"), LIMITS.message);
  const jobId = text(form.get("jobId"), 40);

  if (!name || !phone) return json(400, { ok: false, error: "Missing required fields." });
  if (!/^[+\d][\d\s()-]{5,}$/.test(phone)) return json(400, { ok: false, error: "Phone number looks wrong." });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { ok: false, error: "Email looks wrong." });

  const cv = form.get("cv");
  let file: { data: Buffer; mimetype: string; name: string; size: number } | null = null;
  if (cv instanceof File && cv.size > 0) {
    const ext = (cv.name.split(".").pop() || "").toLowerCase();
    const allowed = TYPES[ext];
    if (!allowed || (cv.type && !allowed.includes(cv.type))) return json(400, { ok: false, error: "File type not allowed." });
    if (cv.size > MAX_BYTES) return json(400, { ok: false, error: "File too large." });
    const base = cv.name.replace(/\.[^.]*$/, "").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "cv";
    file = { data: Buffer.from(await cv.arrayBuffer()), mimetype: allowed[0], name: `${base}-${Date.now()}.${ext}`, size: cv.size };
  }

  try {
    const payload = await getCms();
    let cvId: string | number | undefined;
    if (file) {
      const saved = await payload!.create({ collection: "private-files", overrideAccess: true, data: {}, file } as never);
      cvId = (saved as { id: string | number }).id;
    }
    await payload!.create({
      collection: "applications",
      overrideAccess: true,
      data: { job: relId(jobId), name, phone, email: email || undefined, message: message || undefined, cv: cvId },
    } as never);
    return json(200, { ok: true });
  } catch (err) {
    console.error("[apply] saving the application failed:", err);
    return json(502, { ok: false, reason: "delivery-failed" });
  }
}
