"use client";

import { useEffect, useState } from "react";
import type { Content } from "@/lib/content.en";
import { CONTACT, type Locale } from "@/lib/site";

type Status = { tone: "ok" | "error"; title: string; text: string } | null;

export function EnquiryForm({ lang, t }: { lang: Locale; t: Content["contact"]["form"] }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  // Arriving from a product page ("Enquire about this product"): remember the
  // product and start the message with its name.
  const [product, setProduct] = useState<{ id: string; title: string } | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const id = q.get("product");
    if (id) setProduct({ id, title: q.get("topic") || "" });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (!data.name?.trim() || !data.phone?.trim() || !data.message?.trim()) {
      setStatus({ tone: "error", title: t.errTitle, text: t.required });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, viber: data.viber === "on", lang, product: product?.id, sourcePage: window.location.pathname + window.location.search }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        form.reset();
        setStatus({ tone: "ok", title: t.okTitle, text: t.okText });
      } else if (body.reason === "unconfigured") {
        setStatus({ tone: "error", title: t.errTitle, text: t.unconfigured });
      } else if (res.status === 400) {
        setStatus({ tone: "error", title: t.errTitle, text: t.required });
      } else {
        setStatus({ tone: "error", title: t.errTitle, text: t.errText });
      }
    } catch {
      setStatus({ tone: "error", title: t.errTitle, text: t.errText });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <div className="field">
          <label htmlFor="f-name">{t.name}</label>
          <input id="f-name" name="name" autoComplete="name" required maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="f-company">{t.company}</label>
          <input id="f-company" name="company" autoComplete="organization" maxLength={160} />
        </div>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor="f-phone">{t.phone}</label>
          <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={40} placeholder="09 …" />
        </div>
        <div className="field">
          <label htmlFor="f-email">{t.email} <span className="hint">({t.emailHint})</span></label>
          <input id="f-email" name="email" type="email" autoComplete="email" maxLength={200} />
        </div>
      </div>
      <label className="check">
        <input type="checkbox" name="viber" defaultChecked />
        <span>{t.viber}</span>
      </label>
      <div className="form__row">
        <div className="field">
          <label htmlFor="f-who">{t.who}</label>
          <select id="f-who" name="who" defaultValue={t.whoOptions[0]}>
            {t.whoOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-about">{t.about}</label>
          <select id="f-about" name="about" defaultValue={t.aboutOptions[0]}>
            {t.aboutOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-message">{t.message}</label>
        <textarea id="f-message" name="message" required maxLength={5000} placeholder={t.messagePlaceholder} key={product?.title ?? ""} defaultValue={product?.title ? `${product.title}: ` : ""} />
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
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
