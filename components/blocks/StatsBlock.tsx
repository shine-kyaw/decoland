import type { BlockProps } from "@/lib/cms-types";

export function StatsBlock({ block }: BlockProps) {
  const items = (block.items ?? []) as Array<{ value?: string; label?: string }>;
  if (!block.heading && !items.length) return null;
  return (
    <section className="statement-band">
      <div className="wrap">
        {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
        <div className="stats">
          {items.map((p, n) => (
            <div className="stat" key={`${p.value}-${n}`} data-reveal>
              <span className="stat__k">{p.value}</span>
              <span className="stat__l">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
