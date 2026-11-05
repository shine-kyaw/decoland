import { RichText } from "@payloadcms/richtext-lexical/react";
import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { CmsLink, Pic } from "./_shared";

export function TextImageBlock({ block, lang }: BlockProps) {
  const src = imgSrc(block.image, block.imageSrc);
  if (!block.heading && !block.body) return null;
  return (
    <section className="section">
      <div className={`wrap two-col cms-textimage${block.imageSide === "left" ? " cms-textimage--left" : ""}`}>
        <div className="cms-textimage__text" style={{ display: "grid", gap: 16, alignContent: "center" }}>
          {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
          {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          {block.body ? <div className="cms-prose"><RichText data={block.body} /></div> : null}
          <div><CmsLink link={block.link} lang={lang} className="btn" /></div>
        </div>
        {src ? (
          <div className="cms-textimage__img" data-reveal>
            <Pic src={src} alt={imgAlt(block.image, block.heading ?? "")} w={1200} h={900} sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
