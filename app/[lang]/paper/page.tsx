import Link from "next/link";
import { getContent, pageMeta } from "@/lib/dict";
import { hrefFor, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMeta(lang, "paper", "paper");
}

export default async function Paper({ params }: Props) {
  const { lang } = await params;
  const t = getContent(lang);
  const p = t.paper;

  return (
    <>
      <div className="wrap page-head">
        <p className="kicker">{p.kicker}</p>
        <h1 data-reveal="mask">{p.h1}</h1>
        <p className="lead">{p.lead}</p>
      </div>

      <section className="section--tight">
        <div className="wrap">
          <div className="cats">
            {p.categories.map((c, i) => (
              <article className="cat" key={c.title} data-reveal>
                <span className="cat__n">{String(i + 1).padStart(2, "0")} / {String(p.categories.length).padStart(2, "0")}</span>
                <div className="cat__head">
                  <h2 style={{ fontSize: "clamp(26px, 1.2rem + 1.2vw, 38px)" }}>{c.title}</h2>
                  <p>{c.blurb}</p>
                </div>
                <ul className="grades" lang="en">{c.grades.map((g) => <li key={g}>{g}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap two-col">
          <div className="statement" data-reveal>
            <p className="kicker">{p.copyTitle}</p>
            <p>{p.copyText}</p>
          </div>
          <div style={{ alignSelf: "end" }}>
            <div className="note"><span className="slash" aria-hidden /><p>{p.note}</p></div>
          </div>
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap cta-band">
          <div>
            <h2 data-reveal="mask">{p.ctaTitle}</h2>
            <p className="lead">{p.ctaText}</p>
          </div>
          <Link className="btn btn--ghost" href={`${hrefFor(lang, "contact")}#enquiry`}>{t.home.ctaPrimary}</Link>
        </div>
      </section>
    </>
  );
}
