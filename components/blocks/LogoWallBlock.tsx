import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { Pic } from "./_shared";

export function LogoWallBlock({ block, ctx }: BlockProps) {
  const brands = ctx.brands
    .filter((b) => b.distributed !== false)
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
    .map((b) => ({ b, src: imgSrc(b.logo, b.logoSrc) }))
    .filter((x) => x.src);
  if (!brands.length) return null;
  return (
    <section className="section--tight band-soft">
      <div className="wrap">
        <div className="section-head">
          {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
          {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
        </div>
        <div className="brands">
          {brands.map(({ b, src }) => (
            <div className="brand-tile" key={b.id ?? b.name} data-reveal>
              <Pic src={src!} alt={imgAlt(b.logo, b.name ?? "")} w={520} h={327} sizes="(max-width: 760px) 33vw, 20vw" />
            </div>
          ))}
        </div>
        {block.note ? <p className="muted" style={{ marginTop: 20 }}>{block.note}</p> : null}
      </div>
    </section>
  );
}
