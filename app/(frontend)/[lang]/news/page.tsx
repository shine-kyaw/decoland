import { notFound } from "next/navigation";
import { PostsListBlock } from "@/components/blocks/PostsListBlock";
import { renderCmsPage } from "@/components/CmsPage";
import { getBlockContext } from "@/lib/cms";
import { isCmsEnabled } from "@/lib/payload";
import { SITE_URL, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };
const L = {
  en: { title: "News & CSR", kicker: "Deco-Land" },
  my: { title: "သတင်းနှင့် လူမှုရေး ဆောင်ရွက်ချက်များ", kicker: "Deco-Land" },
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return { title: `${L[lang].title} | Deco-Land`, alternates: { canonical: `${SITE_URL}/${lang}/news` } };
}

export default async function News({ params }: Props) {
  const { lang } = await params;
  if (!isCmsEnabled()) notFound();
  const cms = await renderCmsPage("news", lang);
  if (cms) return cms;
  const ctx = await getBlockContext(lang);
  return <PostsListBlock lang={lang} ctx={ctx} block={{ blockType: "postsList", kicker: L[lang].kicker, heading: L[lang].title, limit: 50 }} />;
}
