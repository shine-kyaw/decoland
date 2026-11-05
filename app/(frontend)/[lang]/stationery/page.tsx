import { renderCmsPage } from "@/components/CmsPage";
import Link from "next/link";
import { External } from "@/components/Icons";
import { Placeholder } from "@/components/Placeholder";
import { getContent, pageMeta } from "@/lib/dict";
import { APOLO_URL, hrefFor, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMeta(lang, "stationery", "stationery");
}

export default async function Stationery({ params }: Props) {
  const { lang } = await params;
  // Edited in the admin? Show that version; otherwise the built-in page below.
  const cms = await renderCmsPage("stationery", lang);
  if (cms) return cms;
  const t = getContent(lang);
  const s = t.stationery;

  return (
    <>
      <div className="wrap page-head">
        <p className="kicker">{s.kicker}</p>
        <h1 data-reveal="mask">{s.h1}</h1>
        <p className="lead">{s.lead}</p>
        <div><a className="btn" href={APOLO_URL} rel="noopener">{s.shopCta} <External /></a></div>
      </div>

      <div className="wrap"><Placeholder label={t.placeholders.photo} style={{ minHeight: 240 }} /></div>

      <section className="section">
        <div className="wrap">
          <div className="section-head"><h2 data-reveal="mask">{s.familiesTitle}</h2></div>
          <div className="cards">
            {s.families.map((f, i) => (
              <div className="card" key={f.title} data-reveal>
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-surface">
        <div className="wrap two-col">
          <div style={{ display: "grid", gap: 16, alignContent: "start" }} data-reveal>
            <h2>{s.forBuyersTitle}</h2>
            <p className="lead">{s.forBuyersText}</p>
            <div><Link className="btn" href={`${hrefFor(lang, "contact")}#enquiry`}>{t.home.ctaPrimary}</Link></div>
          </div>
          <div style={{ display: "grid", gap: 16, alignContent: "start" }} data-reveal>
            <h2>{s.shopTitle}</h2>
            <p className="lead">{s.shopText}</p>
            <div><a className="arrow-link" href={APOLO_URL} rel="noopener">{s.shopCta} <External /></a></div>
          </div>
        </div>
      </section>
    </>
  );
}
