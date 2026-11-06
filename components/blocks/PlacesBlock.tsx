import type { BlockProps } from "@/lib/cms-types";

type Addr = { id?: string; label?: string; name?: string; address?: string; mapUrl?: string };

export function PlacesBlock({ block, lang, ctx }: BlockProps) {
  const addresses = ((ctx.settings.addresses ?? []) as Addr[]).filter((a) => a && (a.name || a.address));
  const hours = typeof ctx.settings.hours === "string" ? ctx.settings.hours.trim() : "";
  const showHours = block.showHours !== false && !!hours;
  if (!addresses.length && !showHours) return null;
  const mapLabel = lang === "my" ? "Google Maps ဖြင့်ကြည့်ရန်" : "Google Maps";
  return (
    <section className="section">
      <div className="wrap">
        {block.kicker || block.heading ? (
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          </div>
        ) : null}
        <div className="places">
          {addresses.map((a, n) => {
            const href = a.mapUrl?.trim() || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.address ?? a.name ?? "")}`;
            return (
              <article className="place" key={a.id ?? n} data-reveal>
                {a.label ? <p className="kicker">{a.label}</p> : null}
                {a.name ? <h3>{a.name}</h3> : null}
                {a.address ? <address style={{ whiteSpace: "pre-line" }}>{a.address}</address> : null}
                <a className="btn btn--ghost" href={href} target="_blank" rel="noopener noreferrer">{mapLabel}</a>
              </article>
            );
          })}
          {showHours ? (
            <article className="place place--hours" data-reveal>
              <p className="kicker">{lang === "my" ? "ဖွင့်ချိန်များ" : "Opening hours"}</p>
              <p style={{ whiteSpace: "pre-line", margin: 0 }}>{hours}</p>
            </article>
          ) : null}
        </div>
        {block.note ? <p className="muted places__note">{block.note}</p> : null}
      </div>
    </section>
  );
}
