import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Archivo, Instrument_Sans, IBM_Plex_Mono, Noto_Sans_Myanmar } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactBar } from "@/components/ContactBar";
import { Reveal } from "@/components/Reveal";
import { ChatButton } from "@/components/ChatButton";
import { PageViewBeacon } from "@/components/PageViewBeacon";
import { isCmsEnabled } from "@/lib/payload";
import { getSettings } from "@/lib/cms";
import { getContent } from "@/lib/dict";
import { CONTACT, LOCALES, SITE_URL, isLocale } from "@/lib/site";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
const notoMy = Noto_Sans_Myanmar({ subsets: ["myanmar"], weight: ["400", "600"], variable: "--font-noto-my", display: "swap", preload: false });

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/photos/Logo_Gold_noBg.png", apple: "/photos/Logo_Gold_noBg.png" },
};
export const viewport: Viewport = { themeColor: "#f6f4ee" };

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getContent(lang);

  // Chat button: CMS settings when available, built-in contact details otherwise.
  const settings = (await getSettings(lang)) as Record<string, unknown> | null;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "");
  const messenger = str(settings?.messenger) || CONTACT.messenger;
  const viberDigits = str(settings?.viber).replace(/\D/g, "");
  const viber = viberDigits ? `viber://chat?number=%2B${viberDigits}` : CONTACT.viber;
  const showChat = settings?.showChatButton !== false;

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Deco-Land Co., Ltd.",
    url: SITE_URL,
    logo: `${SITE_URL}/photos/Logo_Gold_noBg.png`,
    foundingDate: "1997",
    email: CONTACT.email,
    telephone: CONTACT.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No.3 (C1 & 2), Ward (9), U Tun Nyo Street, Hlaing Thar Yar Industrial Zone (6)",
      addressLocality: "Hlaing Thar Yar Township, Yangon",
      addressCountry: "MM",
    },
  };

  return (
    // suppressHydrationWarning: the inline script below adds the "js" class
    // before React hydrates, which is intentional.
    <html lang={lang} suppressHydrationWarning className={`${archivo.variable} ${instrument.variable} ${plexMono.variable} ${notoMy.variable}`}>
      <head>
        {/* Marks JS as running so [data-reveal] content may start hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </head>
      <body>
        <a className="skip" href="#main">{t.nav.skip}</a>
        <Header lang={lang} t={t} />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
        <ContactBar t={t} />
        {showChat && <ChatButton lang={lang} messenger={messenger} viber={viber} />}
        <Reveal />
        {/* Visit counter only runs when the CMS (and its database) is on. */}
        {isCmsEnabled() && <PageViewBeacon />}
      </body>
    </html>
  );
}
