import { renderCmsPage } from "@/components/CmsPage";
import Link from "next/link";
import Image from "next/image";
import { Arrow, External } from "@/components/Icons";
import { Channels } from "@/components/Channels";
import { HeroSlider, type Slide } from "@/components/HeroSlider";
import { getContent, pageMeta } from "@/lib/dict";
import { APOLO_URL, hrefFor, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMeta(lang, "home", "");
}

// Real Deco-Land photography from the old site's media library, in slide order.
const HERO = [
  { src: "/img/hero-campus.jpg", alt: "Aerial view of the Deco-Land campus in Hlaing Thar Yar Industrial Zone", position: "50% 60%" },
  { src: "/img/hero-entrance.jpg", alt: "The Deco-Land head office entrance", position: "18% 50%" },
  { src: "/img/hero-gate.jpg", alt: "Deco-Land signage at the main gate", position: "70% 50%" },
  { src: "/img/warehouse.jpg", alt: "Paper stock in the Deco-Land warehouse", position: "40% 50%" },
];
const PILLAR_IMG = ["/img/paper-printing.jpg", "/img/apolo-range.jpg", "/img/svc-custom-print.jpg"];
const PILLAR_HREF = ["paper", "stationery", "services"] as const;
const RANGE = [
  { img: "/img/paper-printing.jpg", key: 1 },
  { img: "/img/paper-packaging.jpg", key: 2 },
  { img: "/img/paper-special.jpg", key: 3 },
  { img: "/img/paper-stationery.jpg", key: 4 },
  { img: "/img/brands/paper-one.jpg", key: 0 },
];
const BRANDS = ["paper-one", "double-a", "copybright", "ik", "glory", "future-star", "sinar-plex", "iplus", "ningbo-star", "apolo"];
const BOOKS = ["books04", "books01", "books013", "books09", "books06", "books020", "books019", "books017", "books05", "books010"];
const SVC_IMG = ["/img/svc-cups.jpg", "/img/svc-custom-print.jpg", "/img/svc-packaging.jpg"];
const GROUP_LOGOS = ["aff-main-label", "aff-hitachielevators", "aff-decotbsp", "aff-moderntech"];

export default async function Home({ params }: Props) {
  const { lang } = await params;
  // Edited in the admin? Show that version; otherwise the built-in page below.
  const cms = await renderCmsPage("home", lang);
  if (cms) return cms;
  const t = getContent(lang);
  const h = t.home;
  const enquire = `${hrefFor(lang, "contact")}#enquiry`;

  const slides: Slide[] = HERO.map((p, n) => ({ ...p, ...h.slides[n] }));

  return (
    <>
      <HeroSlider
        slides={slides}
        cta={{ primary: { href: enquire, label: h.ctaPrimary }, secondary: { href: hrefFor(lang, "paper"), label: h.ctaSecondary } }}
      />

      {/* The old site's headline band, kept, with the confirmed facts beside it. */}
      <section className="statement-band">
        <div className="wrap">
          <h2 data-reveal="mask">{h.statement}</h2>
          <div className="stats">
            {h.proof.map((p) => (
              <div className="stat" key={p.k} data-reveal>
                <span className="stat__k">{p.k}</span>
                <span className="stat__l">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paper · Stationery · Services — the old three columns, now image cards. */}
      <section className="section band-soft">
        <div className="wrap">
          <div className="section-head"><p className="kicker">{h.pillarsKicker}</p></div>
          <div className="pillars">
            {h.pillars.map((p, n) => (
              <Link className="pillar" key={p.title} href={hrefFor(lang, PILLAR_HREF[n])} data-reveal>
                <div className="pillar__img">
                  <Image src={PILLAR_IMG[n]} alt="" width={1000} height={625} sizes="(max-width: 960px) 100vw, 33vw" />
                </div>
                <div className="pillar__body">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <ul className="tags">{p.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
                <div className="pillar__foot"><span className="arrow-link">{p.cta} <Arrow /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head section-head--row">
            <div style={{ display: "grid", gap: 16 }}>
              <p className="kicker">{h.catalogueKicker}</p>
              <h2 data-reveal="mask">{h.catalogueTitle}</h2>
              <p className="lead">{h.catalogueText}</p>
            </div>
            <Link className="btn btn--ghost" href={hrefFor(lang, "paper")}>{h.catalogueCta}</Link>
          </div>
          <div className="range">
            {RANGE.map((r) => {
              const cat = t.paper.categories[r.key];
              return (
                <Link className="range__item" key={cat.title} href={hrefFor(lang, "paper")} data-reveal>
                  <div className="range__img"><Image src={r.img} alt="" width={1000} height={400} sizes="(max-width: 860px) 100vw, 50vw" /></div>
                  <div className="range__body"><h3>{cat.title}</h3><span aria-hidden><Arrow /></span></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section--tight band-soft">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">{h.brandsKicker}</p>
            <h2 data-reveal="mask">{h.brandsTitle}</h2>
          </div>
          <div className="brands">
            {BRANDS.map((b) => (
              <div className="brand-tile" key={b} data-reveal>
                <Image src={`/img/brands/${b}.jpg`} alt={b.replace(/-/g, " ")} width={520} height={327} sizes="(max-width: 760px) 33vw, 20vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap apolo">
          <div className="apolo__intro">
            <p className="kicker">{h.apoloKicker}</p>
            <h2 data-reveal="mask">{h.apoloTitle}</h2>
            <p className="lead">{h.apoloText}</p>
            <div className="btns">
              <Link className="btn" href={hrefFor(lang, "stationery")}>{h.apoloCta}</Link>
              <a className="btn btn--ghost" href={APOLO_URL} rel="noopener">{h.apoloShop} <External /></a>
            </div>
          </div>
          <div>
            <div className="rail" tabIndex={0} aria-label={h.apoloTitle}>
              {BOOKS.map((b) => (
                <div className="rail__item" key={b}>
                  <Image src={`/img/apolo/${b}.jpg`} alt="APOLO book" width={600} height={800} sizes="(max-width: 960px) 62vw, 22vw" />
                </div>
              ))}
            </div>
            <div className="apolo__banner">
              <Image src="/img/apolo-range.jpg" alt="The APOLO stationery range" width={1001} height={360} sizes="(max-width: 960px) 100vw, 60vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="section band-dark on-dark">
        <div className="wrap">
          <div className="facility__text">
            <div style={{ display: "grid", gap: 16 }}>
              <p className="kicker">{h.facilityKicker}</p>
              <h2 data-reveal="mask">{h.facilityTitle}</h2>
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              <p className="lead">{h.facilityText}</p>
              <div className="facility__points">
                {h.facilityPoints.map((f) => <div key={f.k}><strong>{f.k}</strong><span className="muted">{f.label}</span></div>)}
              </div>
            </div>
          </div>
          <div className="facility">
            <div className="facility__main" data-reveal>
              <Image src="/img/campus-aerial.jpg" alt="The Deco-Land campus from above" fill sizes="(max-width: 900px) 100vw, 66vw" />
            </div>
            <div className="facility__side">
              <div data-reveal>
                <Image src="/img/warehouse.jpg" alt="The Deco-Land warehouse" fill sizes="(max-width: 900px) 50vw, 33vw" />
                <span className="facility__cap">{h.slides[3].tab}</span>
              </div>
              <div data-reveal>
                <Image src="/img/signage.jpg" alt="Deco-Land signage" fill sizes="(max-width: 900px) 50vw, 33vw" style={{ objectPosition: "30% 50%" }} />
                <span className="facility__cap">{h.slides[1].tab}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section band-soft">
        <div className="wrap">
          <div className="section-head section-head--row">
            <div style={{ display: "grid", gap: 16 }}>
              <p className="kicker">{h.servicesKicker}</p>
              <h2 data-reveal="mask">{h.servicesTitle}</h2>
              <p className="lead">{h.servicesText}</p>
            </div>
            <Link className="btn btn--ghost" href={hrefFor(lang, "services")}>{t.home.pillars[2].cta}</Link>
          </div>
          <div className="svcs">
            {h.services.map((s, n) => (
              <article className="svc" key={s.title} data-reveal>
                <div className="svc__img"><Image src={SVC_IMG[n]} alt="" width={1000} height={625} sizes="(max-width: 900px) 100vw, 33vw" /></div>
                <div className="svc__body"><h3>{s.title}</h3><p>{s.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap group">
          <div style={{ display: "grid", gap: 16 }}>
            <p className="kicker">{h.groupKicker}</p>
            <h2 data-reveal="mask">{h.groupTitle}</h2>
            <p className="lead">{h.groupText}</p>
            <div><Link className="arrow-link" href={hrefFor(lang, "group")}>{h.groupCta} <Arrow /></Link></div>
          </div>
          <div data-reveal>
            <div className="group__logos">
              {GROUP_LOGOS.map((g, n) => (
                <div className="group__logo" key={g}>
                  <Image src={`/img/group/${g}.png`} alt={t.group.companies[n]?.title ?? g} width={368} height={79} />
                </div>
              ))}
              <div className="group__logo"><img src="/photos/Logo_Gold_noBg.png" alt="Deco-Land" style={{ maxHeight: 64 }} /></div>
              <div className="group__logo"><img src="/img/brands/apolo.jpg" alt="APOLO" style={{ maxHeight: 56, borderRadius: 4 }} /></div>
            </div>
            <div className="group__photos">
              <Image src="/img/moderntech.jpg" alt="Modern Tech showroom" width={1200} height={375} sizes="(max-width: 900px) 50vw, 30vw" />
              <Image src="/img/tbsp-team.jpg" alt="The Deco-TBSP team" width={1262} height={360} sizes="(max-width: 900px) 50vw, 30vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap vm">
          <div data-reveal><p className="kicker">{t.about.visionTitle}</p><p>{t.about.vision}</p></div>
          <div data-reveal className="on-dark"><p className="kicker">{t.about.missionTitle}</p><p>{t.about.mission}</p></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="contact-band on-dark">
            <div>
              <h2>{h.contactTitle}</h2>
              <p>{h.contactText}</p>
            </div>
            <Channels t={t} />
          </div>
        </div>
      </section>
    </>
  );
}
