import { renderCmsPage } from "@/components/CmsPage";
import Link from "next/link";
import { Placeholder } from "@/components/Placeholder";
import { getContent, pageMeta } from "@/lib/dict";
import { hrefFor, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMeta(lang, "services", "services");
}

export default async function Services({ params }: Props) {
  const { lang } = await params;
  // Edited in the admin? Show that version; otherwise the built-in page below.
  const cms = await renderCmsPage("services", lang);
  if (cms) return cms;
  const t = getContent(lang);
  const s = t.services;

  return (
    <>
      <div className="wrap page-head">
        <p className="kicker">{s.kicker}</p>
        <h1 data-reveal="mask">{s.h1}</h1>
        <p className="lead">{s.lead}</p>
      </div>

      <section className="section--tight">
        <div className="wrap">
          {s.blocks.map((b) => (
            <article className="service" key={b.title} data-reveal>
              <div className="service__head">
                <h2 style={{ fontSize: "clamp(28px, 1.3rem + 1.4vw, 44px)" }}>{b.title}</h2>
                <p>{b.text}</p>
              </div>
              <ul className="list-dash">{b.list.map((l) => <li key={l}>{l}</li>)}</ul>
            </article>
          ))}
          <div style={{ marginTop: 8 }}><Placeholder label={t.placeholders.specs} inline /></div>
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap">
          <div className="section-head">
            <h2 data-reveal="mask">{s.processTitle}</h2>
            <p className="lead">{s.processLead}</p>
          </div>
          <ol className="steps">{s.steps.map((st) => <li key={st} data-reveal>{st}</li>)}</ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap cta-band">
          <div>
            <h2 data-reveal="mask">{s.ctaTitle}</h2>
            <p className="lead">{s.ctaText}</p>
          </div>
          <Link className="btn" href={`${hrefFor(lang, "contact")}#enquiry`}>{t.home.ctaPrimary}</Link>
        </div>
      </section>
    </>
  );
}
