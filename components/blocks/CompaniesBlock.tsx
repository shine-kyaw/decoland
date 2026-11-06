import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { Pic } from "./_shared";

export function CompaniesBlock({ block, ctx }: BlockProps) {
  const list = ctx.groupCompanies;
  if (!list.length) return null;
  return (
    <section className="section band-soft">
      <div className="wrap">
        <div className="section-head">
          {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
          {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          {block.text ? <p className="lead">{block.text}</p> : null}
        </div>
        <div className="cos">
          {list.map((c, n) => {
            const logo = imgSrc(c.logo, c.logoSrc);
            const photo = imgSrc(c.photo, c.photoSrc);
            const site = c.website?.trim();
            const href = site ? (/^https?:/i.test(site) ? site : `https://${site}`) : "";
            return (
              <article className="company cos__card" key={c.id ?? n} data-reveal>
                {logo ? <div className="cos__logo"><Pic src={logo} alt={imgAlt(c.logo, c.name ?? "")} w={320} h={120} sizes="240px" /></div> : null}
                <h3>{c.name}</h3>
                {c.summary ? <p>{c.summary}</p> : null}
                {photo ? <div className="cos__photo"><Pic src={photo} alt={imgAlt(c.photo)} w={900} h={560} sizes="(max-width: 900px) 100vw, 45vw" /></div> : null}
                {href ? <a className="arrow-link" href={href} target="_blank" rel="noopener noreferrer">{(site ?? "").replace(/^https?:\/\//i, "").replace(/\/$/, "")}</a> : null}
              </article>
            );
          })}
        </div>
        {block.note ? <p className="muted places__note">{block.note}</p> : null}
      </div>
    </section>
  );
}
