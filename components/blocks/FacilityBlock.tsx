import Image from "next/image";
import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";

export function FacilityBlock({ block }: BlockProps) {
  const main = imgSrc(block.main, block.mainSrc);
  const s1 = imgSrc(block.side1, block.side1Src);
  const s2 = imgSrc(block.side2, block.side2Src);
  const points = (block.points ?? []) as Array<{ value?: string; label?: string }>;
  if (!block.heading && !main) return null;
  return (
    <section className="section band-dark on-dark">
      <div className="wrap">
        <div className="facility__text">
          <div style={{ display: "grid", gap: 16 }}>
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            {block.text ? <p className="lead">{block.text}</p> : null}
            {points.length ? (
              <div className="facility__points">
                {points.map((f, n) => <div key={`${f.value}-${n}`}><strong>{f.value}</strong><span className="muted">{f.label}</span></div>)}
              </div>
            ) : null}
          </div>
        </div>
        {main || s1 || s2 ? (
          <div className="facility">
            {main ? (
              <div className="facility__main" data-reveal>
                <Image src={main} alt={imgAlt(block.main, block.heading ?? "")} fill sizes="(max-width: 900px) 100vw, 66vw" />
              </div>
            ) : null}
            {s1 || s2 ? (
              <div className="facility__side">
                {s1 ? (
                  <div data-reveal>
                    <Image src={s1} alt={imgAlt(block.side1, block.side1Caption ?? "")} fill sizes="(max-width: 900px) 50vw, 33vw" />
                    {block.side1Caption ? <span className="facility__cap">{block.side1Caption}</span> : null}
                  </div>
                ) : null}
                {s2 ? (
                  <div data-reveal>
                    <Image src={s2} alt={imgAlt(block.side2, block.side2Caption ?? "")} fill sizes="(max-width: 900px) 50vw, 33vw" />
                    {block.side2Caption ? <span className="facility__cap">{block.side2Caption}</span> : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
