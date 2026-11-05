import Link from "next/link";
import { Arrow } from "@/components/Icons";
import { imgSrc, imgAlt, localHref } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { Pic } from "./_shared";

export function ImageCardsBlock({ block, lang }: BlockProps) {
  const cards = (block.cards ?? []) as Array<Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!cards.length) return null;
  return (
    <section className="section band-soft">
      <div className="wrap">
        {(block.kicker || block.heading) && (
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          </div>
        )}
        <div className="pillars">
          {cards.map((c, n) => {
            const src = imgSrc(c.image, c.imageSrc);
            const href = localHref(c.link?.url, lang) || `/${lang}`;
            const tags = String(c.tags ?? "").split(",").map((s) => s.trim()).filter(Boolean);
            return (
              <Link className="pillar" key={c.id ?? n} href={href} data-reveal>
                {src ? <div className="pillar__img"><Pic src={src} alt={imgAlt(c.image)} w={1000} h={625} sizes="(max-width: 960px) 100vw, 33vw" /></div> : null}
                <div className="pillar__body">
                  <h3>{c.title}</h3>
                  {c.text ? <p>{c.text}</p> : null}
                  {tags.length ? <ul className="tags">{tags.map((t) => <li key={t}>{t}</li>)}</ul> : null}
                </div>
                {c.link?.label ? <div className="pillar__foot"><span className="arrow-link">{c.link.label} <Arrow /></span></div> : null}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
