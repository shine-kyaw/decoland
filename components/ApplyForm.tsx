"use client";

import { useState } from "react";
import { CONTACT, type Locale } from "@/lib/site";

type Status = { tone: "ok" | "error"; title: string; text: string } | null;

// 4 MB: Vercel rejects request bodies over ~4.5 MB before this code runs.
const MAX_BYTES = 4 * 1024 * 1024;
const EXT = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];

const L = {
  en: {
    name: "Full name", phone: "Phone", email: "Email", emailHint: "optional", message: "A few words about you", cv: "CV", cvHint: "PDF, DOC, DOCX, JPG or PNG, up to 4 MB",
    send: "Send application", sending: "Sending…",
    okTitle: "Application received", okText: "Thank you. Our team will be in touch if there is a fit.",
    errTitle: "We could not send that", required: "Please add your name and a valid phone number.",
    badFile: "The CV must be a PDF, DOC, DOCX, JPG or PNG file of 4 MB or less.",
    unconfigured: "Applications are not switched on yet. Please send your CV by email instead.",
    errText: "Something went wrong on our side. Please try again, or send your CV directly.", errMail: "Email us",
  },
  my: {
    name: "အမည်အပြည့်အစုံ", phone: "ဖုန်းနံပါတ်", email: "အီးမေးလ်", emailHint: "ရွေးချယ်စရာ", message: "သင့်အကြောင်း အနည်းငယ်", cv: "CV", cvHint: "PDF, DOC, DOCX, JPG သို့မဟုတ် PNG (၄ MB အထိ)",
    send: "လျှောက်လွှာ ပို့မည်", sending: "ပို့နေသည်…",
    okTitle: "လျှောက်လွှာ လက်ခံရရှိပါပြီ", okText: "ကျေးဇူးတင်ပါသည်။ သင့်လျော်ပါက ကျွန်ုပ်တို့ ဆက်သွယ်ပါမည်။",
    errTitle: "မပို့နိုင်ပါ", required: "အမည်နှင့် မှန်ကန်သော ဖုန်းနံပါတ် ထည့်ပေးပါ။",
    badFile: "CV သည် PDF, DOC, DOCX, JPG သို့မဟုတ် PNG ဖြစ်ပြီး ၄ MB အောက် ဖြစ်ရပါမည်။",
    unconfigured: "လျှောက်လွှာစနစ် မဖွင့်သေးပါ။ CV ကို အီးမေးလ်ဖြင့် ပို့ပေးပါ။",
    errText: "ကျွန်ုပ်တို့ဘက်တွင် အမှားတစ်ခု ဖြစ်သွားပါသည်။ ထပ်ကြိုးစားပါ၊ သို့မဟုတ် CV ကို တိုက်ရိုက်ပို့ပါ။", errMail: "အီးမေးလ်ပို့ရန်",
  },
};

export function ApplyForm({ lang, jobId }: { lang: Locale; jobId?: string | number }) {
  const t = L[lang === "my" ? "my" : "en"];
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const err = (text: string) => setStatus({ tone: "error", title: t.errTitle, text });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!String(data.get("name") ?? "").trim() || !/^[+\d][\d\s()-]{5,}$/.test(String(data.get("phone") ?? "").trim())) return err(t.required);
    const cv = data.get("cv");
    if (cv instanceof File && cv.size > 0) {
      const ext = (cv.name.split(".").pop() || "").toLowerCase();
      if (!EXT.includes(ext) || cv.size > MAX_BYTES) return err(t.badFile);
    } else {
      data.delete("cv");
    }
    if (jobId !== undefined) data.set("jobId", String(jobId));
    data.set("lang", lang);
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/apply", { method: "POST", body: data });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        form.reset();
        setStatus({ tone: "ok", title: t.okTitle, text: t.okText });
      } else if (body.reason === "unconfigured") err(t.unconfigured);
      else if (res.status === 400) err(/type|large/i.test(String(body.error)) ? t.badFile : t.required);
      else err(t.errText);
    } catch {
      err(t.errText);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form apply-form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <div className="field">
          <label htmlFor="a-name">{t.name}</label>
          <input id="a-name" name="name" autoComplete="name" required maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="a-phone">{t.phone}</label>
          <input id="a-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={40} placeholder="09 …" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="a-email">{t.email} <span className="hint">({t.emailHint})</span></label>
        <input id="a-email" name="email" type="email" autoComplete="email" maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="a-message">{t.message}</label>
        <textarea id="a-message" name="message" maxLength={5000} />
      </div>
      <div className="field">
        <label htmlFor="a-cv">{t.cv} <span className="hint">({t.cvHint})</span></label>
        <input id="a-cv" name="cv" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="a-website">Website</label>
        <input id="a-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div aria-live="polite">
        {status && (
          <div className="form-status" data-tone={status.tone}>
            <p><strong>{status.title}</strong></p>
            <p>{status.text}</p>
            {status.tone === "error" && (
              <p><a href={`mailto:${CONTACT.email}`}>{t.errMail}: {CONTACT.email}</a> · <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a></p>
            )}
          </div>
        )}
      </div>
      <div>
        <button className="btn" type="submit" disabled={sending}>{sending ? t.sending : t.send}</button>
      </div>
    </form>
  );
}
