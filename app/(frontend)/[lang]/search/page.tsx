import Link from "next/link";
import { notFound } from "next/navigation";
import { getCms, isCmsEnabled } from "@/lib/payload";
import { imgSrc } from "@/lib/media";
import { SITE_URL, type Locale } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: Locale }>; searchParams: Promise<{ q?: string | string[] }> };
type Doc = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const L = {
  en: {
    title: "Search", kicker: "Deco-Land", label: "Search the site", placeholder: "Search products, news and pages", go: "Search",
    prompt: "Type a word above to search products, news and pages.",
    none: (q: string) => `No results for “${q}”. Try a shorter or different word.`,
    found: (n: number, q: string) => `${n} result${n === 1 ? "" : "s"} for “${q}”`,
    products: "Products", news: "News", pages: "Pages",
  },
  my: {
    title: "ရှာဖွေရန်", kicker: "Deco-Land", label: "ဝက်ဘ်ဆိုက်တွင် ရှာဖွေရန်", placeholder: "ထုတ်ကုန်၊ သတင်းနှင့် စာမျက်နှာများ ရှာဖွေပါ", go: "ရှာဖွေရန်",
    prompt: "ထုတ်ကုန်၊ သတင်းနှင့် စာမျက်နှာများ ရှာရန် စကားလုံးတစ်ခု ရိုက်ထည့်ပါ။",
    none: (q: string) => `“${q}” အတွက် ရလဒ် မတွေ့ပါ။ တိုတောင်းသော သို့မဟုတ် အခြားစကားလုံးဖြင့် ရှာကြည့်ပါ။`,
    found: (n: number, q: string) => `“${q}” အတွက် ရလဒ် ${n} ခု`,
    products: "ထုတ်ကုန်များ", news: "သတင်းများ", pages: "စာမျက်နှာများ",
  },
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return { title: `${L[lang].title} | Deco-Land`, robots: { index: false }, alternates: { canonical: `${SITE_URL}/${lang}/search` } };
}

async function run(lang: Locale, q: string) {
  const payload = await getCms();
  if (!payload) return { products: [], posts: [], pages: [] };
  const base = { locale: lang, fallbackLocale: "en", limit: 20, depth: 1, overrideAccess: false, pagination: false } as const;
  const safe = async (collection: string, where: unknown): Promise<Doc[]> => {
    try {
      const res = await payload.find({ collection: collection as never, where: where as never, ...base } as never);
      return res.docs as unknown as Doc[];
    } catch (err) {
      console.error(`[search] ${collection} failed`, err);
      return [];
    }
  };
  const [products, posts, pages] = await Promise.all([
    safe("products", { or: [{ title: { like: q } }, { summary: { like: q } }] }),
    safe("posts", { or: [{ title: { like: q } }, { excerpt: { like: q } }] }),
    safe("pages", { title: { like: q } }),
  ]);
  return { products, posts, pages };
}

export default async function Search({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isCmsEnabled()) notFound();
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = (raw ?? "").trim().slice(0, 80);
  const t = L[lang];
  const res = q ? await run(lang, q) : { products: [], posts: [], pages: [] };
  const total = res.products.length + res.posts.length + res.pages.length;

  return (
    <section className="section--tight search">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">{t.kicker}</p>
          <h1>{t.title}</h1>
        </div>
        <form className="search__form" action={`/${lang}/search`} method="get" role="search">
          <label className="sr-only" htmlFor="search-q">{t.label}</label>
          <input id="search-q" name="q" type="search" defaultValue={q} placeholder={t.placeholder} autoComplete="off" />
          <button type="submit" className="btn">{t.go}</button>
        </form>

        {!q ? <p className="muted search__note">{t.prompt}</p> : total === 0 ? <p className="search__note">{t.none(q)}</p> : <p className="muted search__note">{t.found(total, q)}</p>}

        {res.products.length > 0 && (
          <div className="search__group">
            <h2>{t.products}</h2>
            <ul className="search__list">
              {res.products.map((p) => {
                const first = Array.isArray(p.images) ? p.images[0] : null;
                const thumb = first ? imgSrc(first.image, first.imageSrc) : null;
                return (
                  <li key={p.id}>
                    <Link className="search__item" href={`/${lang}/products/${p.slug}`}>
                      {thumb ? <img src={thumb} alt="" width={72} height={72} loading="lazy" /> : <span className="search__ph" aria-hidden="true" />}
                      <span>
                        <strong>{p.title}</strong>
                        {p.summary ? <small>{p.summary}</small> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {res.posts.length > 0 && (
          <div className="search__group">
            <h2>{t.news}</h2>
            <ul className="search__list">
              {res.posts.map((p) => (
                <li key={p.id}>
                  <Link className="search__item search__item--text" href={`/${lang}/news/${p.slug}`}>
                    <span>
                      <strong>{p.title}</strong>
                      {p.excerpt ? <small>{p.excerpt}</small> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {res.pages.length > 0 && (
          <div className="search__group">
            <h2>{t.pages}</h2>
            <ul className="search__list">
              {res.pages.map((p) => (
                <li key={p.id}>
                  <Link className="search__item search__item--text" href={p.slug === "home" ? `/${lang}` : `/${lang}/${p.slug}`}>
                    <span><strong>{p.title}</strong></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
