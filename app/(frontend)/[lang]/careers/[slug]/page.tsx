import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ApplyForm } from "@/components/ApplyForm";
import { getJob, getJobs } from "@/lib/cms";
import { isCmsEnabled } from "@/lib/payload";
import { hrefFor, SITE_URL, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale; slug: string }> };
type P = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const L = {
  en: { back: "All careers", closes: "Applications close", closed: "This position is no longer accepting applications.", apply: "Apply for this role" },
  my: { back: "အလုပ်အကိုင်အားလုံး", closes: "လျှောက်လွှာ ပိတ်ရက်", closed: "ဤရာထူးအတွက် လျှောက်လွှာ မလက်ခံတော့ပါ။", apply: "ဤရာထူးအတွက် လျှောက်ထားရန်" },
};

export const dynamicParams = true;
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return ((await getJobs(params.lang as Locale)) as P[]).map((x) => ({ slug: String(x.slug) }));
}

// Plain text of a Lexical tree, for the JSON-LD description.
function plain(node: P | null | undefined): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  const kids: P[] = node.children ?? node.root?.children ?? [];
  const sep = ["paragraph", "heading", "listitem", "quote"].includes(node.type) ? "\n" : "";
  return kids.map(plain).join("") + sep;
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const j = (await getJob(slug, lang)) as P | null;
  if (!j) return {};
  return {
    title: `${j.title} | Deco-Land`,
    description: plain(j.description).trim().slice(0, 160) || undefined,
    alternates: { canonical: `${SITE_URL}/${lang}/careers/${slug}` },
  };
}

export default async function Job({ params }: Props) {
  const { lang, slug } = await params;
  if (!isCmsEnabled()) notFound();
  const j = (await getJob(slug, lang)) as P | null;
  if (!j) notFound();
  const t = L[lang];
  const fmt = (d: string) => new Date(d).toLocaleDateString(lang === "my" ? "my-MM" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  const isOpen = j.open !== false;
  const ld = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: plain(j.description).trim() || String(j.title),
    datePosted: j.createdAt,
    validThrough: j.closingDate || undefined,
    employmentType: j.type ? String(j.type).toUpperCase().replace("-", "_") : undefined,
    hiringOrganization: { "@type": "Organization", name: "Deco-Land Co., Ltd.", sameAs: SITE_URL },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Yangon", addressCountry: "MM" } },
  };

  return (
    <article className="section--tight">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap" style={{ maxWidth: 900, display: "grid", gap: 22 }}>
        <Link className="arrow-link" href={hrefFor(lang, "careers")}>← {t.back}</Link>
        <p className="kicker">{[j.department, j.location, j.type].filter(Boolean).join(" · ")}</p>
        <h1 style={{ fontSize: "clamp(30px, 1.2rem + 2.4vw, 56px)" }}>{j.title}</h1>
        {j.closingDate ? <p className="muted">{t.closes}: {fmt(j.closingDate)}</p> : null}
        {j.description ? <div className="cms-prose"><RichText data={j.description} /></div> : null}
        <div className="careers-apply">
          {isOpen ? (
            <>
              <h2>{t.apply}</h2>
              <ApplyForm lang={lang} jobId={j.id} />
            </>
          ) : (
            <p className="muted">{t.closed}</p>
          )}
        </div>
      </div>
    </article>
  );
}
