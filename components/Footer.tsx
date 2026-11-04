import Link from "next/link";
import type { Content } from "@/lib/content.en";
import { APOLO_URL, CONTACT, hrefFor, type Locale } from "@/lib/site";

export function Footer({ lang, t }: { lang: Locale; t: Content }) {
  const year = new Date().getFullYear();
  const links = ["about", "paper", "stationery", "services", "group", "contact"] as const;
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="logo-chip"><img src="/photos/Logo_Gold_noBg.png" alt="Deco-Land" width={56} height={56} /></div>
            <p style={{ margin: 0, maxWidth: "36ch" }}>{t.footer.tagline}</p>
            <p style={{ margin: 0, color: "var(--on-dark-muted)", fontSize: 15 }}>{t.footer.group}</p>
            <span className="slash" aria-hidden />
          </div>
          <div>
            <h2>{t.footer.explore}</h2>
            <ul>
              {links.map((k) => <li key={k}><Link href={hrefFor(lang, k)}>{t.nav[k]}</Link></li>)}
              <li><a href={APOLO_URL} rel="noopener">APOLO® ↗</a></li>
            </ul>
          </div>
          <div>
            <h2>{t.footer.reach}</h2>
            <ul>
              <li><a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a></li>
              <li><a href={CONTACT.viber}>Viber</a></li>
              <li><a href={CONTACT.messenger} rel="noopener">Messenger</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            </ul>
          </div>
          <div>
            <h2>{t.footer.addresses}</h2>
            <address>
              <span><strong style={{ color: "var(--on-dark)", fontWeight: 500 }}>{t.about.hq.label}</strong><br />{t.about.hq.address}</span>
              <span><strong style={{ color: "var(--on-dark)", fontWeight: 500 }}>{t.about.showroom.label}</strong><br />{t.about.showroom.address}</span>
            </address>
          </div>
        </div>
        <div className="footer__base">
          <span>© {year} {t.footer.rights}</span>
          <span>{t.footer.apoloNote}</span>
        </div>
      </div>
    </footer>
  );
}
