import type { BlockProps } from "@/lib/cms-types";

export function StepsBlock({ block }: BlockProps) {
  const items = (block.items ?? []) as Array<{ id?: string; title?: string }>;
  if (!items.length) return null;
  return (
    <section className="section band-dark on-dark">
      <div className="wrap">
        <div className="section-head">
          {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
          {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          {block.text ? <p className="lead">{block.text}</p> : null}
        </div>
        <ol className="steps steps--rich">
          {items.map((s, n) => (
            <li key={s.id ?? n} data-reveal><strong>{s.title}</strong></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
