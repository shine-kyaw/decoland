import { getContent, pageMeta } from "@/lib/dict";
import type { Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMeta(lang, "group", "group");
}

export default async function Group({ params }: Props) {
  const { lang } = await params;
  const g = getContent(lang).group;

  return (
    <>
      <div className="wrap page-head">
        <p className="kicker">{g.kicker}</p>
        <h1 data-reveal="mask">{g.h1}</h1>
        <p className="lead">{g.lead}</p>
      </div>
      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="two-col">
            {g.companies.map((c, i) => (
              <article className="company" key={c.title} data-reveal>
                <span className="kicker">{String(i + 1).padStart(2, "0")}</span>
                <h2>{c.title}</h2>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 32, maxWidth: "60ch" }}>{g.note}</p>
        </div>
      </section>
    </>
  );
}
