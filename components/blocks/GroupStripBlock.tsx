import { Arrow } from "@/components/Icons";
import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { CmsLink, Pic } from "./_shared";

export function GroupStripBlock({ block, lang, ctx }: BlockProps) {
  const logos = ctx.groupCompanies.map((g) => ({ g, src: imgSrc(g.logo, g.logoSrc) })).filter((x) => x.src);
  const photos = ((block.photos ?? []) as Array<Record<string, any>>) // eslint-disable-line @typescript-eslint/no-explicit-any
    .map((p) => ({ p, src: imgSrc(p.image, p.imageSrc) })).filter((x) => x.src);
  if (!block.heading && !logos.length) return null;
  return (
    <section className="section">
      <div className="wrap group">
        <div style={{ display: "grid", gap: 16 }}>
          {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
          {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          {block.text ? <p className="lead">{block.text}</p> : null}
          {block.link?.label && block.link?.url ? (
            <div><CmsLink link={block.link} lang={lang} className="arrow-link">{block.link.label} <Arrow /></CmsLink></div>
          ) : null}
        </div>
        <div data-reveal>
          {logos.length ? (
            <div className="group__logos">
              {logos.map(({ g, src }) => (
                <div className="group__logo" key={g.id ?? g.name}>
                  <Pic src={src!} alt={imgAlt(g.logo, g.name ?? "")} w={368} h={79} />
                </div>
              ))}
            </div>
          ) : null}
          {photos.length ? (
            <div className="group__photos">
              {photos.map(({ p, src }, n) => <Pic key={p.id ?? n} src={src!} alt={imgAlt(p.image)} w={1200} h={375} sizes="(max-width: 900px) 50vw, 30vw" />)}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
