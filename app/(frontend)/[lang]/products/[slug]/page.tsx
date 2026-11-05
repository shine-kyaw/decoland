import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getCategories, getProduct, getProducts } from "@/lib/cms";
import { imgAlt, imgSrc, relId } from "@/lib/media";
import { getContent } from "@/lib/dict";
import { hrefFor, SITE_URL, type Locale } from "@/lib/site";
import { Arrow } from "@/components/Icons";

type Props = { params: Promise<{ lang: Locale; slug: string }> };
type P = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const L = {
  en: { enquire: "Enquire about this product", specs: "Specifications", related: "More in this category", all: "All products", note: "Prices and current stock are confirmed when you enquire." },
  my: { enquire: "ဤပစ္စည်းအကြောင်း စုံစမ်းရန်", specs: "အသေးစိတ်", related: "ဤအမျိုးအစားမှ အခြားပစ္စည်းများ", all: "ပစ္စည်းအားလုံး", note: "စျေးနှုန်းနှင့် လက်ကျန်ကို စုံစမ်းချိန်တွင် အတည်ပြုပေးပါမည်။" },
};

// Pre-render every published product; new ones render on first visit.
export const dynamicParams = true;
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return ((await getProducts(params.lang as Locale)) as P[]).map((x) => ({ slug: String(x.slug) }));
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const p = (await getProduct(slug, lang)) as P | null;
  if (!p) return {};
  const title = p.meta?.title || `${p.title} | Deco-Land`;
  const description = p.meta?.description || p.summary || undefined;
  const first = p.images?.[0];
  const image = imgSrc(first?.image, first?.imageSrc);
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/${lang}/products/${slug}`, languages: { en: `${SITE_URL}/en/products/${slug}`, my: `${SITE_URL}/my/products/${slug}` } },
    openGraph: { title, description, images: image ? [{ url: image }] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  const p = (await getProduct(slug, lang)) as P | null;
  if (!p) notFound();
  const t = L[lang];
  const nav = getContent(lang).nav;
  const cats = (await getCategories(lang)) as P[];
  const catId = relId(p.category);
  const cat = cats.find((c) => String(c.id) === catId);
  const related = ((await getProducts(lang)) as P[]).filter((x) => relId(x.category) === catId && x.slug !== slug).slice(0, 4);
  const images = (p.images ?? []).map((i: P) => ({ src: imgSrc(i.image, i.imageSrc), alt: imgAlt(i.image, p.title) })).filter((i: { src: string | null }) => i.src);
  const divisionPath = cat?.division === "stationery" ? "stationery" : cat?.division === "services" ? "services" : "paper";
  const enquire = `${hrefFor(lang, "contact")}?product=${encodeURIComponent(String(p.id))}&topic=${encodeURIComponent(p.title)}#enquiry`;

  return (
    <>
      <div className="wrap" style={{ paddingTop: 28 }}>
        <nav aria-label="Breadcrumb" className="muted" style={{ fontSize: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href={hrefFor(lang, "")}>{nav.home}</Link><span>/</span>
          <Link href={hrefFor(lang, divisionPath)}>{nav[divisionPath]}</Link>
          {cat ? <><span>/</span><span>{cat.title}</span></> : null}
        </nav>
      </div>
      <section className="section--tight">
        <div className="wrap pd">
          <div className="pd__media">
            {images.length ? (
              <>
                <div className="pd__main"><Image src={images[0].src} alt={images[0].alt} width={1200} height={900} priority sizes="(max-width: 900px) 100vw, 55vw" /></div>
                {images.length > 1 ? (
                  <div className="pd__thumbs">
                    {images.slice(1, 5).map((im: { src: string; alt: string }) => <div key={im.src}><Image src={im.src} alt={im.alt} width={400} height={300} sizes="20vw" /></div>)}
                  </div>
                ) : null}
              </>
            ) : <div className="pd__main pd__main--empty"><span>{p.title}</span></div>}
          </div>
          <div className="pd__info">
            {cat ? <p className="kicker">{cat.title}</p> : null}
            <h1 style={{ fontSize: "clamp(30px, 1.2rem + 2vw, 48px)" }}>{p.title}</h1>
            {p.summary ? <p className="lead">{p.summary}</p> : null}
            {p.specs?.length ? (
              <div>
                <h2 className="pd__h">{t.specs}</h2>
                <table className="pd__specs"><tbody>
                  {p.specs.map((s: P) => <tr key={s.id ?? s.label}><th scope="row">{s.label}</th><td>{s.value}</td></tr>)}
                </tbody></table>
              </div>
            ) : null}
            <div style={{ display: "grid", gap: 10 }}>
              <Link className="btn" href={enquire}>{t.enquire}</Link>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>{t.note}</p>
            </div>
          </div>
        </div>
        {p.description ? <div className="wrap cms-prose cms-prose--narrow" style={{ marginTop: 40 }}><RichText data={p.description} /></div> : null}
      </section>
      {related.length ? (
        <section className="section--tight band-soft">
          <div className="wrap">
            <div className="section-head section-head--row">
              <h2 style={{ fontSize: "clamp(24px, 1rem + 1.4vw, 34px)" }}>{t.related}</h2>
              <Link className="arrow-link" href={hrefFor(lang, "products")}>{t.all} <Arrow /></Link>
            </div>
            <div className="cards">
              {related.map((r) => {
                const f = r.images?.[0];
                const src = imgSrc(f?.image, f?.imageSrc);
                return (
                  <Link className="card cms-product" key={r.id} href={`/${lang}/products/${r.slug}`}>
                    {src ? <div className="cms-product__img"><Image src={src} alt="" width={600} height={600} sizes="25vw" /></div> : null}
                    <h3>{r.title}</h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
