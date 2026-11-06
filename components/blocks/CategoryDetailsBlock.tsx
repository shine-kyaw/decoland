import Link from "next/link";
import { imgSrc, imgAlt, relId } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { Pic } from "./_shared";

export function CategoryDetailsBlock({ block, lang, ctx }: BlockProps) {
  const cats = ctx.categories
    .filter((c) => c.division === block.division)
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  if (!cats.length) return null;
  const cards = block.display === "cards";
  const seeAll = lang === "my" ? "အားလုံးကြည့်ရန်" : "See all";
  return (
    <section className="section">
      <div className="wrap">
        {block.kicker || block.heading || block.text ? (
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
            {block.text ? <p className="lead">{block.text}</p> : null}
          </div>
        ) : null}
        <div className="catd">
          {cats.map((c) => {
            const src = imgSrc(c.image, c.imageSrc);
            const prods = ctx.products
              .filter((p) => relId(p.category) === String(c.id))
              .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
            return (
              <article className={`catd__row${src ? "" : " catd__row--noimg"}`} key={c.id ?? c.slug} data-reveal>
                {src ? (
                  <div className="catd__img"><Pic src={src} alt={imgAlt(c.image, c.title ?? "")} w={900} h={700} sizes="(max-width: 900px) 100vw, 40vw" /></div>
                ) : null}
                <div className="catd__body">
                  <h3>{c.title}</h3>
                  {c.description ? <p className="muted">{c.description}</p> : null}
                  {prods.length && !cards ? (
                    <ul className="catd__chips">
                      {prods.map((p) => (
                        <li key={p.id ?? p.slug}><Link href={`/${lang}/products/${p.slug}`}>{p.title}</Link></li>
                      ))}
                    </ul>
                  ) : null}
                  {prods.length && cards ? (
                    <>
                      <div className="catd__rail" tabIndex={0} aria-label={c.title ?? ""}>
                        {prods.map((p) => {
                          const im = p.images?.[0];
                          const ps = imgSrc(im?.image, im?.imageSrc);
                          return (
                            <Link className="catd__card" key={p.id ?? p.slug} href={`/${lang}/products/${p.slug}`}>
                              <span className="catd__card-img">{ps ? <Pic src={ps} alt={imgAlt(im?.image, p.title ?? "")} w={400} h={400} sizes="200px" /> : null}</span>
                              <span className="catd__card-t">{p.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                      <Link className="arrow-link" href={`/${lang}/products`}>{seeAll}</Link>
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
