import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Archivo, Instrument_Sans, IBM_Plex_Mono, Noto_Sans_Myanmar } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactBar } from "@/components/ContactBar";
import { Reveal } from "@/components/Reveal";
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
    <html lang={lang} className={`${archivo.variable} ${instrument.variable} ${plexMono.variable} ${notoMy.variable}`}>
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
        <Reveal />
      </body>
    </html>
  );
}
