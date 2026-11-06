"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/lib/content.en";
import { CONTACT, hrefFor, type Locale } from "@/lib/site";

const LINKS = ["about", "paper", "stationery", "services", "group", "contact"] as const;
const SEARCH = {
  en: { label: "Search the site", placeholder: "Search products, news, pages", go: "Search", open: "Open search", close: "Close search" },
  my: { label: "ဝက်ဘ်ဆိုက်တွင် ရှာဖွေရန်", placeholder: "ထုတ်ကုန်၊ သတင်း၊ စာမျက်နှာ ရှာရန်", go: "ရှာဖွေရန်", open: "ရှာဖွေရန် ဖွင့်ရန်", close: "ရှာဖွေရန် ပိတ်ရန်" },
};

export function Header({ lang, t }: { lang: Locale; t: Content }) {
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchBtn = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const s = SEARCH[lang];

  // Same page in the other language: swap the first segment.
  const rest = pathname.replace(/^\/(en|my)(?=\/|$)/, "");
  const current = rest.replace(/^\//, "");

  useEffect(() => { setOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => {
    if (!searchOpen) return;
    searchInput.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); searchBtn.current?.focus(); }
    };
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [searchOpen]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (key: string) => current === key || current.startsWith(`${key}/`);

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <a className="topbar__item" href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>
          <a className="topbar__item topbar__hide" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <span className="topbar__item topbar__hide topbar__end">{t.about.showroom.label}: {t.about.showroom.name}</span>
        </div>
      </div>
      <header className="header" data-scrolled={scrolled || open}>
        <div className="wrap header__inner">
          <Link href={hrefFor(lang, "")} className="brand" aria-label={`${t.siteName} — ${t.nav.home}`}>
            <img src="/photos/Logo_Gold_noBg.png" alt="" width={50} height={50} />
            <span>DECO-LAND</span>
          </Link>

          <nav className="nav" aria-label="Primary">
            {LINKS.map((key) => (
              <Link key={key} href={hrefFor(lang, key)} aria-current={isCurrent(key) ? "page" : undefined}>
                {t.nav[key]}
              </Link>
            ))}
          </nav>

          <div className="hsearch" ref={searchRef}>
            <button ref={searchBtn} type="button" className="hsearch__btn" aria-expanded={searchOpen} aria-controls="hsearch-panel" aria-label={searchOpen ? s.close : s.open} onClick={() => setSearchOpen((v) => !v)}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
            {searchOpen && (
              <form id="hsearch-panel" className="hsearch__panel" action={`/${lang}/search`} method="get" role="search">
                <label className="sr-only" htmlFor="hsearch-q">{s.label}</label>
                <input ref={searchInput} id="hsearch-q" name="q" type="search" placeholder={s.placeholder} autoComplete="off" />
                <button type="submit" className="btn">{s.go}</button>
              </form>
            )}
          </div>

          <div className="lang" role="group" aria-label={t.nav.language}>
            <a href={`/en${rest}`} hrefLang="en" lang="en" aria-current={lang === "en"}>EN</a>
            <a href={`/my${rest}`} hrefLang="my" lang="my" aria-current={lang === "my"}>မြန်မာ</a>
          </div>

          <Link href={`${hrefFor(lang, "contact")}#enquiry`} className="btn btn--desktop">{t.nav.enquire}</Link>

          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </header>

      {open && (
        <nav id="drawer" className="drawer" aria-label="Mobile">
          <form className="drawer__search" action={`/${lang}/search`} method="get" role="search">
            <label className="sr-only" htmlFor="drawer-q">{s.label}</label>
            <input id="drawer-q" name="q" type="search" placeholder={s.placeholder} autoComplete="off" />
            <button type="submit" className="btn">{s.go}</button>
          </form>
          <Link className="drawer__link" href={hrefFor(lang, "")} aria-current={current === "" ? "page" : undefined}>{t.nav.home}</Link>
          {LINKS.map((key) => (
            <Link key={key} className="drawer__link" href={hrefFor(lang, key)} aria-current={isCurrent(key) ? "page" : undefined}>
              {t.nav[key]}
            </Link>
          ))}
          <Link href={`${hrefFor(lang, "contact")}#enquiry`} className="btn">{t.nav.enquire}</Link>
        </nav>
      )}
    </>
  );
}
