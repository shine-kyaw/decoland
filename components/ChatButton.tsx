"use client";

import { useEffect, useRef, useState } from "react";

type Props = { lang: "en" | "my"; messenger: string; viber: string };

const T = {
  en: { open: "Chat with us", close: "Close chat menu", messenger: "Chat on Messenger", viber: "Chat on Viber", title: "Chat with Deco-Land" },
  my: { open: "ချက်တင်ပြောရန်", close: "ချက်တင်မီနူး ပိတ်ရန်", messenger: "Messenger ဖြင့် ပြောရန်", viber: "Viber ဖြင့် ပြောရန်", title: "Deco-Land နှင့် ချက်တင်ပြောရန်" },
};

export function ChatButton({ lang, messenger, viber }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const t = T[lang];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btn.current?.focus(); }
    };
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  return (
    <div className="chat" ref={root} data-open={open}>
      {open && (
        <div className="chat__pop" role="dialog" aria-label={t.title}>
          <a className="chat__opt" href={messenger} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.18 2 11.34c0 2.94 1.45 5.56 3.72 7.27V22l3.4-1.87c.87.24 1.8.37 2.88.37 5.52 0 10-4.18 10-9.34S17.52 2 12 2Zm1 12.55-2.55-2.72-4.97 2.72 5.47-5.8 2.61 2.72 4.91-2.72-5.47 5.8Z" /></svg>
            {t.messenger}
          </a>
          <a className="chat__opt" href={viber}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2C7 2 3 4.5 3 10c0 2.6 1 4.5 2.6 5.8V21l3.2-2.4c1 .3 2 .4 3.2.4 5 0 9-2.5 9-8s-4-9-9-9Z" /></svg>
            {t.viber}
          </a>
        </div>
      )}
      <button ref={btn} type="button" className="chat__btn" aria-expanded={open} aria-label={open ? t.close : t.open} onClick={() => setOpen((v) => !v)}>
        {open ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /></svg>
        )}
      </button>
    </div>
  );
}
