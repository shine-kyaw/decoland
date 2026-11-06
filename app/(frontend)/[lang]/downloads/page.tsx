import { notFound } from "next/navigation";
import { DownloadsListBlock } from "@/components/blocks/DownloadsListBlock";
import { renderCmsPage } from "@/components/CmsPage";
import { getBlockContext } from "@/lib/cms";
import { isCmsEnabled } from "@/lib/payload";
import { SITE_URL, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };
const L = {
  en: { title: "Downloads", kicker: "Deco-Land", profile: "Company profile", catalogue: "Catalogues", certificate: "Certificates" },
  my: { title: "ဒေါင်းလုဒ်များ", kicker: "Deco-Land", profile: "ကုမ္ပဏီ ပရိုဖိုင်", catalogue: "ကက်တလောက်များ", certificate: "လက်မှတ်များ" },
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return { title: `${L[lang].title} | Deco-Land`, alternates: { canonical: `${SITE_URL}/${lang}/downloads` } };
}

export default async function Downloads({ params }: Props) {
  const { lang } = await params;
  if (!isCmsEnabled()) notFound();
  const cms = await renderCmsPage("downloads", lang);
  if (cms) return cms;
  const ctx = await getBlockContext(lang);
  const t = L[lang];
  const groups = [
    { category: "profile", heading: t.profile },
    { category: "catalogue", heading: t.catalogue },
    { category: "certificate", heading: t.certificate },
  ];
  return (
    <>
      <section className="section--tight">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">{t.kicker}</p>
            <h1>{t.title}</h1>
          </div>
        </div>
      </section>
      {groups.map((g) => (
        <DownloadsListBlock key={g.category} lang={lang} ctx={ctx} block={{ blockType: "downloadsList", category: g.category, heading: g.heading }} />
      ))}
    </>
  );
}
