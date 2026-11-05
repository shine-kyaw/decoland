import { imgSrc, imgAlt, relId } from "@/lib/media";
import type { BlockProps, Product } from "@/lib/cms-types";
import { CmsLink, Pic } from "./_shared";

function pickProducts(block: Record<string, any>, all: Product[]): Product[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (block.source === "category") {
    const id = relId(block.category);
    return id ? all.filter((p) => relId(p.category) === id) : [];
  }
  if (block.source === "picked") {
    const ids = ((block.products ?? []) as unknown[]).map(relId);
    return ids.map((id) => all.find((p) => String(p.id) === id)).filter(Boolean) as Product[];
  }
  return all.filter((p) => p.featured).sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

export function ProductRailBlock({ block, lang, ctx }: BlockProps) {
  const items = pickProducts(block, ctx.products)
    .map((p) => ({ p, src: imgSrc(p.images?.[0]?.image, p.images?.[0]?.imageSrc) }))
    .filter((x) => x.src);
  if (!items.length && !block.heading) return null;
  const banner = imgSrc(block.banner, block.bannerSrc);
  return (
    <section className="section">
      <div className="wrap apolo">
        <div className="apolo__intro">
          {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
          {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          {block.text ? <p className="lead">{block.text}</p> : null}
          <div className="btns">
            <CmsLink link={block.primary} lang={lang} className="btn" />
            <CmsLink link={block.secondary} lang={lang} className="btn btn--ghost" />
          </div>
        </div>
        <div>
          {items.length ? (
            <div className="rail" tabIndex={0} aria-label={block.heading ?? ""}>
              {items.map(({ p, src }) => (
                <div className="rail__item" key={p.id ?? p.slug}>
                  <Pic src={src!} alt={imgAlt(p.images?.[0]?.image, p.title ?? "")} w={600} h={800} sizes="(max-width: 960px) 62vw, 22vw" />
                </div>
              ))}
            </div>
          ) : null}
          {banner ? (
            <div className="apolo__banner">
              <Pic src={banner} alt={imgAlt(block.banner)} w={1001} h={360} sizes="(max-width: 960px) 100vw, 60vw" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
