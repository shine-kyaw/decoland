import { imgSrc } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { Pic } from "./_shared";

export function DownloadsListBlock({ block, lang, ctx }: BlockProps) {
  const items = ctx.downloads
    .filter((d) => !block.category || d.category === block.category)
    .map((d) => ({ d, href: imgSrc(d.file) }))
    .filter((x) => x.href)
    .sort((a, b) => (a.d.order ?? 100) - (b.d.order ?? 100));
  if (!items.length) return null;
  return (
    <section className="section--tight">
      <div className="wrap">
        {(block.kicker || block.heading) && (
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          </div>
        )}
        <div className="cms-list">
          {items.map(({ d, href }) => {
            const cover = imgSrc(d.cover, d.coverSrc);
            return (
              <a className="cms-row" key={d.id ?? d.title} href={href!} rel="noopener" download data-reveal>
                {cover ? <Pic src={cover} alt="" w={96} h={128} /> : null}
                <div>
                  <h3>{d.title}</h3>
                  {d.category ? <p className="muted" style={{ textTransform: "capitalize" }}>{d.category}</p> : null}
                </div>
                <span className="arrow-link">{lang === "my" ? "ဒေါင်းလုဒ်" : "Download"}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
