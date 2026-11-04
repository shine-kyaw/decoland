import Link from "next/link";
import Image from "next/image";
import { FoldCup } from "@/components/FoldCup";
import { Arrow } from "@/components/Icons";
import { Channels } from "@/components/Channels";
import { getContent, pageMeta } from "@/lib/dict";
import { hrefFor, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMeta(lang, "home", "");
}

const DIVISION_PATHS = ["paper", "stationery", "services"] as const;

function DivisionVisual({ i }: { i: number }) {
  if (i === 0) return <div className="swatch swatch--stack" />;
  if (i === 1) return <div className="swatch swatch--books"><i /><i /><i /></div>;
  return (
    <div className="swatch swatch--box">
      {/* Folding-carton net: cut lines solid, creases dashed */}
      <svg viewBox="0 0 120 150" aria-hidden>
        <g fill="none" strokeWidth="1.2">
          <path stroke="var(--ink)" d="M30 10h60v30h25v70H90v30H30v-30H5V40h25Z" />
          <path stroke="var(--green)" strokeDasharray="4 3" d="M30 40h60M30 110h60M30 40v70M90 40v70" />
        </g>
      </svg>
    </div>
  );
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const t = getContent(lang);
  const h = t.home;

  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__text">
            <p className="kicker">{h.eyebrow}</p>
            <h1>
              <span className="line">{h.h1[0]}</span>
              <span className="line">{h.h1[1]}</span>
            </h1>
            <p className="lead">{h.lead}</p>
            <div className="hero__ctas">
              <Link className="btn" href={`${hrefFor(lang, "contact")}#enquiry`}>{h.ctaPrimary}</Link>
              <Link className="btn btn--ghost" href={hrefFor(lang, "paper")}>{h.ctaSecondary}</Link>
            </div>
          </div>
          <div className="hero__stage">
            <div className="stage crop">
              <FoldCup label={h.dieLine} />
            </div>
            <div className="stage__label"><span>{h.dieLine}</span><span>Deco-Land</span></div>
          </div>
        </div>
      </section>

      <section className="section--tight" aria-label={h.proof.map((p) => p.k).join(", ")}>
        <div className="wrap">
          <div className="proof">
            {h.proof.map((p) => (
              <div className="proof__item" key={p.k} data-reveal>
                <span className="proof__k">{p.k}</span>
                <span className="proof__label">{p.label}</span>
              </div>
            ))}
          </div>
          <p className="claim" data-reveal><span className="slash" aria-hidden />{h.claim}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 data-reveal="mask">{h.divisionsTitle}</h2>
          </div>
          <div className="divisions">
            {h.divisions.map((d, i) => (
              <article className="division" key={d.kicker} data-reveal>
                <div className="visual"><DivisionVisual i={i} /></div>
                <p className="kicker">{d.kicker}</p>
                <div style={{ display: "grid", gap: 10 }}>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
                <Link className="arrow-link" href={hrefFor(lang, DIVISION_PATHS[i])}>{d.cta} <Arrow /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap buyers">
          <div className="buyers__text">
            <p className="kicker">{h.buyersKicker}</p>
            <h2 data-reveal="mask">{h.buyersTitle}</h2>
            <p className="lead">{h.buyersText}</p>
            <ul className="ticks">{h.buyersPoints.map((p) => <li key={p}>{p}</li>)}</ul>
            <div><Link className="btn btn--ghost" href={`${hrefFor(lang, "contact")}#enquiry`}>{h.ctaPrimary}</Link></div>
          </div>
          <div className="buyers__media crop" data-reveal>
            <Image
              src="/photos/Home.jpg"
              alt=""
              width={1280}
              height={360}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap group-strip">
          <div style={{ display: "grid", gap: 18 }}>
            <h2 data-reveal="mask">{h.groupTitle}</h2>
            <p className="lead">{h.groupText}</p>
            <div><Link className="arrow-link" href={hrefFor(lang, "group")}>{h.groupCta} <Arrow /></Link></div>
          </div>
          <ul className="group-names" data-reveal>
            {t.group.companies.map((c) => <li key={c.title}>{c.title}</li>)}
          </ul>
        </div>
      </section>

      <section className="section band-surface">
        <div className="wrap">
          <div className="section-head">
            <h2 data-reveal="mask">{h.contactTitle}</h2>
            <p className="lead">{h.contactText}</p>
          </div>
          <Channels t={t} />
        </div>
      </section>
    </>
  );
}
