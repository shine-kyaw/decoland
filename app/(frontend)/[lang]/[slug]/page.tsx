import { notFound } from "next/navigation";
import { renderCmsPage } from "@/components/CmsPage";
import { getPage } from "@/lib/cms";
import { SITE_URL, type Locale } from "@/lib/site";

/*
  Any page staff create in Pages (Admin → Content → Pages) appears at
  /<lang>/<slug>. Built-in routes (about, paper, …) take priority over this
  catch-all but also defer to a CMS page with the same slug.
*/
type Props = { params: Promise<{ lang: Locale; slug: string }> };
type P = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const page = (await getPage(slug, lang)) as P | null;
  if (!page) return {};
  return {
    title: page.meta?.title || `${page.title} | Deco-Land`,
    description: page.meta?.description || undefined,
    alternates: { canonical: `${SITE_URL}/${lang}/${slug}` },
  };
}

export default async function CmsRoute({ params }: Props) {
  const { lang, slug } = await params;
  const out = await renderCmsPage(slug, lang);
  if (!out) notFound();
  return out;
}
