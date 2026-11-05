import type { BlockProps } from "@/lib/cms-types";
import { CmsLink } from "./_shared";

export function CtaBlock({ block, lang }: BlockProps) {
  if (!block.heading) return null;
  const style = block.style === "dark" || block.style === "light" ? block.style : "green";
  const btn = style === "light" ? "btn" : "btn btn--yellow";
  return (
    <section className="section--tight">
      <div className="wrap">
        <div className={`cms-cta cms-cta--${style}${style === "light" ? "" : " on-dark"}`}>
          <div className="cta-band">
            <div>
              <h2>{block.heading}</h2>
              {block.text ? <p>{block.text}</p> : null}
            </div>
            <CmsLink link={block.link} lang={lang} className={btn} />
          </div>
        </div>
      </div>
    </section>
  );
}
