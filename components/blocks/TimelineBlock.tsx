import type { BlockProps } from "@/lib/cms-types";

export function TimelineBlock({ block }: BlockProps) {
  const items = (block.items ?? []) as Array<{ id?: string; year?: string; text?: string }>;
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        {block.kicker || block.heading ? (
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          </div>
        ) : null}
        <ol className="tl">
          {items.map((m, n) => (
            <li className="tl__item" key={m.id ?? n} data-reveal>
              <span className="tl__year">{m.year}</span>
              <p>{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
