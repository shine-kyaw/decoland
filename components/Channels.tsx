import type { Content } from "@/lib/content.en";
import { CONTACT } from "@/lib/site";

/** Four equal contact routes: phone, Viber, Messenger, email. */
export function Channels({ t }: { t: Content }) {
  const c = t.contact.channels;
  const items = [
    { k: c.call, v: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneTel}` },
    { k: c.viber, v: CONTACT.phoneDisplay, href: CONTACT.viber },
    { k: c.messenger, v: "Apolo Stationery", href: CONTACT.messenger, external: true },
    { k: c.email, v: CONTACT.email, href: `mailto:${CONTACT.email}` },
  ];
  return (
    <div className="channels">
      {items.map((i) => (
        <a key={i.k} className="channel" href={i.href} rel={i.external ? "noopener" : undefined}>
          <span className="channel__k">{i.k}</span>
          <span className="channel__v">{i.v}</span>
        </a>
      ))}
    </div>
  );
}
