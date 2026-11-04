import type { Content } from "@/lib/content.en";
import { CONTACT } from "@/lib/site";
import { Chat, Mail, Phone, Viber } from "./Icons";

/** Sticky four-way contact bar on phones (hidden from 900px up). */
export function ContactBar({ t }: { t: Content }) {
  return (
    <nav className="cbar" aria-label={t.contact.channelsTitle}>
      <a href={`tel:${CONTACT.phoneTel}`}><Phone />{t.contactBar.call}</a>
      <a href={CONTACT.viber}><Viber />{t.contactBar.viber}</a>
      <a href={CONTACT.messenger} rel="noopener"><Chat />{t.contactBar.messenger}</a>
      <a href={`mailto:${CONTACT.email}`}><Mail />{t.contactBar.email}</a>
    </nav>
  );
}
