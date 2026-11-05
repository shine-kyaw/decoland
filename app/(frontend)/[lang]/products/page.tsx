import { notFound } from "next/navigation";
import { ProductGridBlock } from "@/components/blocks/ProductGridBlock";
import { renderCmsPage } from "@/components/CmsPage";
import { getBlockContext } from "@/lib/cms";
import { isCmsEnabled } from "@/lib/payload";
import { SITE_URL, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };

const L = {
  en: { title: "Products", lead: "Paper, APOLO stationery and supplies. No prices online: enquire for current prices and stock." },
  my: { title: "ထုတ်ကုန်များ", lead: "စက္ကူ၊ APOLO စာရေးကိရိယာနှင့် ပစ္စည်းများ။ စျေးနှုန်းနှင့် လက်ကျန်အတွက် စုံစမ်းပါ။" },
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return { title: `${L[lang].title} | Deco-Land`, description: L[lang].lead, alternates: { canonical: `${SITE_URL}/${lang}/products` } };
}

/** All products, grouped by category. A CMS page with the address "products" replaces this. */
export default async function Products({ params }: Props) {
  const { lang } = await params;
  if (!isCmsEnabled()) notFound();
  const cms = await renderCmsPage("products", lang);
  if (cms) return cms;
  const ctx = await getBlockContext(lang);
  return (
    <ProductGridBlock
      lang={lang}
      ctx={ctx}
      block={{ blockType: "productGrid", kicker: "Deco-Land", heading: L[lang].title, text: L[lang].lead, showFilters: true }}
    />
  );
}
