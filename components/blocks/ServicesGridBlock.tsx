import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { CmsLink, Pic } from "./_shared";

/** One bullet per line in the CMS textarea. */
const pts = (v: unknown): string[] => (typeof v === "string" ? v.split(/[\r\n]+/).map((x) => x.trim()).filter(Boolean) : []);

export function ServicesGridBlock({ block, lang }: BlockProps) {
  const items = (block.items ?? []) as Array<Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!items.length) return null;
  return (
    <section className="section band-soft">
      <div className="wrap">
        <div className="section-head section-head--row">
          <div style={{ display: "grid", gap: 16 }}>
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
            {block.text ? <p className="lead">{block.text}</p> : null}
          </div>
          <CmsLink link={block.link} lang={lang} className="btn btn--ghost" />
        </div>
        <div className="svcs">
          {items.map((s, n) => {
            const src = imgSrc(s.image, s.imageSrc);
            const points = pts(s.points);
            return (
              <article className="svc" key={s.id ?? n} data-reveal>
                {src ? <div className="svc__img"><Pic src={src} alt={imgAlt(s.image)} w={1000} h={625} sizes="(max-width: 900px) 100vw, 33vw" /></div> : null}
                <div className="svc__body">
                  <h3>{s.title}</h3>
                  {s.text ? <p>{s.text}</p> : null}
                  {points.length ? <ul className="list-dash svc__points">{points.map((x, i) => <li key={i}>{x}</li>)}</ul> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
