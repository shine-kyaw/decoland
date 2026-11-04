import Link from "next/link";
import Image from "next/image";
import { Placeholder } from "@/components/Placeholder";
import { getContent, pageMeta } from "@/lib/dict";
import { hrefFor, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMeta(lang, "about", "about");
}

export default async function About({ params }: Props) {
  const { lang } = await params;
  const t = getContent(lang);
  const a = t.about;

  return (
    <>
      <div className="wrap page-head">
        <p className="kicker">{a.kicker}</p>
        <h1 data-reveal="mask">{a.h1}</h1>
        <p className="lead">{a.lead}</p>
      </div>

      <div className="wrap page-media">
        <div className="crop">
          <Image
            src="/photos/Deco_Land_Paper_Stationery.jpg"
            alt={a.photoAlt}
            width={1600}
            height={504}
            priority
            sizes="(max-width: 1320px) 100vw, 1320px"
            style={{ objectPosition: "22% 50%" }}
          />
        </div>
      </div>

      <section className="section">
        <div className="wrap two-col">
          <h2 data-reveal="mask">{a.storyTitle}</h2>
          <div className="prose" data-reveal>{a.story.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
      </section>

      <section className="section band-surface">
        <div className="wrap">
          <div className="section-head"><h2 data-reveal="mask">{a.timelineTitle}</h2></div>
          <ol className="timeline">
            {a.timeline.map((m) => (
              <li key={m.year} data-reveal>
                <span className="year">{m.year}</span>
                <span>{m.text}</span>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: 24 }}><Placeholder label={t.placeholders.milestones} inline /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap two-col">
          <div className="statement" data-reveal>
            <p className="kicker">{a.visionTitle}</p>
            <p>{a.vision}</p>
          </div>
          <div className="statement" data-reveal>
            <p className="kicker">{a.missionTitle}</p>
            <p>{a.mission}</p>
          </div>
        </div>
      </section>

      <section className="section band-surface">
        <div className="wrap">
          <div className="section-head"><h2 data-reveal="mask">{a.placesTitle}</h2></div>
          <div className="two-col">
            {[a.hq, a.showroom].map((p) => (
              <div className="place" key={p.label} data-reveal>
                <p className="kicker">{p.label}</p>
                <h3>{p.name}</h3>
                <address>{p.address}</address>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap cta-band">
          <div>
            <h2 data-reveal="mask">{a.ctaTitle}</h2>
            <p className="lead">{a.ctaText}</p>
          </div>
          <Link className="btn" href={`${hrefFor(lang, "contact")}#enquiry`}>{t.home.ctaPrimary}</Link>
        </div>
      </section>
    </>
  );
}
