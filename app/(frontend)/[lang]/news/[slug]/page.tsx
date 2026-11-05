import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPost, getPosts } from "@/lib/cms";
import { imgAlt, imgSrc } from "@/lib/media";
import { hrefFor, SITE_URL, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale; slug: string }> };
type P = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const L = { en: { back: "All news" }, my: { back: "သတင်းအားလုံး" } };

export const dynamicParams = true;
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return ((await getPosts(params.lang as Locale)) as P[]).map((x) => ({ slug: String(x.slug) }));
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const p = (await getPost(slug, lang)) as P | null;
  if (!p) return {};
  const cover = imgSrc(p.cover, p.coverSrc);
  return {
    title: p.meta?.title || `${p.title} | Deco-Land`,
    description: p.meta?.description || p.excerpt || undefined,
    alternates: { canonical: `${SITE_URL}/${lang}/news/${slug}` },
    openGraph: { type: "article", images: cover ? [{ url: cover }] : undefined },
  };
}

export default async function Post({ params }: Props) {
  const { lang, slug } = await params;
  const p = (await getPost(slug, lang)) as P | null;
  if (!p) notFound();
  const cover = imgSrc(p.cover, p.coverSrc);
  const date = p.publishedAt ? new Date(p.publishedAt).toLocaleDateString(lang === "my" ? "my-MM" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
  const gallery = (p.gallery ?? []).map((g: P) => ({ src: imgSrc(g.image, g.imageSrc), alt: imgAlt(g.image) })).filter((g: { src: string | null }) => g.src);

  return (
    <article className="section--tight">
      <div className="wrap" style={{ maxWidth: 900, display: "grid", gap: 22 }}>
        <Link className="arrow-link" href={hrefFor(lang, "news")}>← {L[lang].back}</Link>
        <p className="kicker">{[typeof p.category === "object" ? p.category?.title : "", date].filter(Boolean).join(" · ")}</p>
        <h1 style={{ fontSize: "clamp(30px, 1.2rem + 2.4vw, 56px)" }}>{p.title}</h1>
        {cover ? <Image src={cover} alt={imgAlt(p.cover, p.title)} width={1400} height={930} priority style={{ width: "100%", height: "auto", borderRadius: "var(--r)" }} sizes="(max-width: 900px) 100vw, 900px" /> : null}
        {p.body ? <div className="cms-prose"><RichText data={p.body} /></div> : null}
        {gallery.length ? (
          <div className="cms-gallery">
            {gallery.map((g: { src: string; alt: string }) => <figure key={g.src}><Image src={g.src} alt={g.alt} width={800} height={530} sizes="(max-width: 760px) 50vw, 300px" /></figure>)}
          </div>
        ) : null}
      </div>
    </article>
  );
}
