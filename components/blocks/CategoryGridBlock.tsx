import Link from "next/link";
import { Arrow } from "@/components/Icons";
import { imgSrc, imgAlt, relId, localHref } from "@/lib/media";
import type { BlockProps, Category } from "@/lib/cms-types";
import { CmsLink, Pic } from "./_shared";

export function CategoryGridBlock({ block, lang, ctx }: BlockProps) {
  let cats: Category[];
  if (block.division) {
    cats = ctx.categories.filter((c) => c.division === block.division);
  } else {
    const ids = ((block.categories ?? []) as unknown[]).map(relId);
    cats = ids.map((id) => ctx.categories.find((c) => String(c.id) === id)).filter(Boolean) as Category[];
  }
  cats = [...cats].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  if (!cats.length) return null;
  const href = localHref(block.link?.url, lang) || `/${lang}`;
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head section-head--row">
          <div style={{ display: "grid", gap: 16 }}>
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
            {block.text ? <p className="lead">{block.text}</p> : null}
          </div>
          <CmsLink link={block.link} lang={lang} className="btn btn--ghost" />
        </div>
        <div className="range">
          {cats.map((c) => {
            const src = imgSrc(c.image, c.imageSrc);
            return (
              <Link className="range__item" key={c.id ?? c.slug} href={href} data-reveal>
                {src ? <div className="range__img"><Pic src={src} alt={imgAlt(c.image)} w={1000} h={400} sizes="(max-width: 860px) 100vw, 50vw" /></div> : null}
                <div className="range__body"><h3>{c.title}</h3><span aria-hidden><Arrow /></span></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
