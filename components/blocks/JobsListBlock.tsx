import Link from "next/link";
import { Arrow } from "@/components/Icons";
import type { BlockProps } from "@/lib/cms-types";

export function JobsListBlock({ block, lang, ctx }: BlockProps) {
  const jobs = ctx.jobs.filter((j) => j.open !== false);
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
          {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
          {block.text ? <p className="lead">{block.text}</p> : null}
        </div>
        {jobs.length ? (
          <div className="cms-list">
            {jobs.map((j) => (
              <Link className="cms-row" key={j.id ?? j.slug} href={`/${lang}/careers/${j.slug}`} data-reveal>
                <div>
                  <h3>{j.title}</h3>
                  <p className="muted">{[j.department, j.location, j.type].filter(Boolean).join(" · ")}</p>
                </div>
                <span className="arrow-link" aria-hidden><Arrow /></span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">{lang === "my" ? "ယခုအချိန်တွင် လစ်လပ်နေသော ရာထူး မရှိပါ။" : "There are no open positions right now."}</p>
        )}
      </div>
    </section>
  );
}
