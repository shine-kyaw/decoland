import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { Pic } from "./_shared";

export function GalleryBlock({ block }: BlockProps) {
  const imgs = ((block.images ?? []) as Array<Record<string, any>>) // eslint-disable-line @typescript-eslint/no-explicit-any
    .map((i) => ({ i, src: imgSrc(i.image, i.imageSrc) })).filter((x) => x.src);
  if (!imgs.length) return null;
  return (
    <section className="section--tight">
      <div className="wrap">
        {(block.kicker || block.heading) && (
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          </div>
        )}
        <div className="cms-gallery">
          {imgs.map(({ i, src }, n) => (
            <figure key={i.id ?? n} data-reveal>
              <Pic src={src!} alt={imgAlt(i.image, i.caption ?? "")} w={1000} h={750} sizes="(max-width: 760px) 50vw, 33vw" />
              {i.caption ? <figcaption>{i.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
