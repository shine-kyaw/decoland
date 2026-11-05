import Link from "next/link";
import { imgSrc, imgAlt, relId } from "@/lib/media";
import type { BlockProps, Product } from "@/lib/cms-types";
import { Pic, titleOf } from "./_shared";

export function ProductGridBlock({ block, lang, ctx }: BlockProps) {
  const catId = relId(block.category);
  const divisionCats = block.division ? new Set(ctx.categories.filter((c) => c.division === block.division).map((c) => String(c.id))) : null;
  const products = ctx.products
    .filter((p) => (catId ? relId(p.category) === catId : divisionCats ? divisionCats.has(relId(p.category) ?? "") : true))
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  if (!products.length) return null;

  // With filters on and no single category chosen, group by category (no client JS needed).
  const grouped = block.showFilters !== false && !catId;
  const groups = new Map<string, Product[]>();
  for (const p of products) {
    const key = grouped ? (titleOf(p.category) || ctx.categories.find((c) => String(c.id) === relId(p.category))?.title || "") : "";
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }

  const card = (p: Product) => {
    const first = p.images?.[0];
    const src = imgSrc(first?.image, first?.imageSrc);
    return (
      <Link className="card cms-product" key={p.id ?? p.slug} href={`/${lang}/products/${p.slug}`} data-reveal>
        {src ? <div className="cms-product__img"><Pic src={src} alt={imgAlt(first?.image, p.title ?? "")} w={600} h={600} sizes="(max-width: 760px) 50vw, 25vw" /></div> : null}
        <h3>{p.title}</h3>
        {p.summary ? <p>{p.summary}</p> : null}
      </Link>
    );
  };

  return (
    <section className="section">
      <div className="wrap">
        {(block.kicker || block.heading || block.text) && (
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
            {block.text ? <p className="lead">{block.text}</p> : null}
          </div>
        )}
        {[...groups.entries()].map(([name, list]) => (
          <div key={name} style={{ marginBottom: 40 }}>
            {name ? <h3 className="cms-group-title">{name}</h3> : null}
            <div className="cards">{list.map(card)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
