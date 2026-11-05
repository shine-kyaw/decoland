import Link from "next/link";
import { Arrow } from "@/components/Icons";
import { imgSrc, imgAlt, relId } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { Pic, titleOf } from "./_shared";

export function PostsListBlock({ block, lang, ctx }: BlockProps) {
  const catId = relId(block.category);
  const limit = Number(block.limit) > 0 ? Number(block.limit) : 3;
  const posts = ctx.posts
    .filter((p) => !catId || relId(p.category) === catId)
    .sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")))
    .slice(0, limit);
  if (!posts.length) return null;
  const fmt = new Intl.DateTimeFormat(lang === "my" ? "my-MM" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <section className="section">
      <div className="wrap">
        {(block.kicker || block.heading) && (
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          </div>
        )}
        <div className="pillars">
          {posts.map((p) => {
            const src = imgSrc(p.cover, p.coverSrc);
            const cat = titleOf(p.category);
            return (
              <Link className="pillar" key={p.id ?? p.slug} href={`/${lang}/news/${p.slug}`} data-reveal>
                {src ? <div className="pillar__img"><Pic src={src} alt={imgAlt(p.cover)} w={1000} h={625} sizes="(max-width: 960px) 100vw, 33vw" /></div> : null}
                <div className="pillar__body">
                  {(cat || p.publishedAt) ? (
                    <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                      {[cat, p.publishedAt ? fmt.format(new Date(p.publishedAt)) : ""].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                  <h3>{p.title}</h3>
                  {p.excerpt ? <p>{p.excerpt}</p> : null}
                </div>
                <div className="pillar__foot"><span className="arrow-link">{lang === "my" ? "ဆက်ဖတ်ရန်" : "Read more"} <Arrow /></span></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
