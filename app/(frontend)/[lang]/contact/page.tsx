import { renderCmsPage } from "@/components/CmsPage";
import Image from "next/image";
import { Channels } from "@/components/Channels";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Placeholder } from "@/components/Placeholder";
import { getContent, pageMeta } from "@/lib/dict";
import type { Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMeta(lang, "contact", "contact");
}

const mapHref = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default async function Contact({ params }: Props) {
  const { lang } = await params;
  // Edited in the admin? Show that version; otherwise the built-in page below.
  const cms = await renderCmsPage("contact", lang);
  if (cms) return cms;
  const t = getContent(lang);
  const c = t.contact;
  const a = t.about;

  return (
    <>
      <div className="wrap page-head">
        <p className="kicker">{c.kicker}</p>
        <h1 data-reveal="mask">{c.h1}</h1>
        <p className="lead">{c.lead}</p>
      </div>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="sr-only">{c.channelsTitle}</h2>
          <Channels t={t} />
        </div>
      </section>

      <section className="section band-surface" id="enquiry">
        <div className="wrap two-col">
          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <h2>{c.formTitle}</h2>
            <p className="lead">{c.formLead}</p>
            <div className="crop" style={{ marginTop: 24 }}>
              <Image
                src="/photos/DecoLand.jpg"
                alt=""
                width={1280}
                height={360}
                sizes="(max-width: 800px) 100vw, 50vw"
                style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", objectPosition: "45% 50%" }}
              />
            </div>
          </div>
          <EnquiryForm lang={lang} t={c.form} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head"><h2 data-reveal="mask">{c.placesTitle}</h2></div>
          <div className="two-col">
            {[a.hq, a.showroom].map((p) => (
              <div className="place" key={p.label} data-reveal>
                <p className="kicker">{p.label}</p>
                <h3>{p.name}</h3>
                <address>{p.address}</address>
                <a className="arrow-link" href={mapHref(p.address)} rel="noopener">Google Maps ↗</a>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}><Placeholder label={t.placeholders.hours} inline /></div>
        </div>
      </section>
    </>
  );
}
