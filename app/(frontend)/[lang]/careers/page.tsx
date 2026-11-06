import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/ApplyForm";
import { JobsListBlock } from "@/components/blocks/JobsListBlock";
import { renderCmsPage } from "@/components/CmsPage";
import { getBlockContext } from "@/lib/cms";
import { isCmsEnabled } from "@/lib/payload";
import { SITE_URL, type Locale } from "@/lib/site";

type Props = { params: Promise<{ lang: Locale }> };
const L = {
  en: {
    title: "Careers", kicker: "Join Deco-Land", lead: "Open positions across the Deco-Land group.",
    referral: "We also hire through referrals and scouting. Send your CV anyway.", apply: "General application",
  },
  my: {
    title: "အလုပ်အကိုင်များ", kicker: "Deco-Land နှင့်အတူ", lead: "Deco-Land group အတွင်း လက်ရှိ ဖွင့်လှစ်ထားသော ရာထူးများ။",
    referral: "ကျွန်ုပ်တို့သည် မိတ်ဆက်ပေးမှုနှင့် ရှာဖွေမှုများမှလည်း ခန့်ထားပါသည်။ သင့် CV ကို ပို့ပေးပါ။", apply: "အထွေထွေ လျှောက်လွှာ",
  },
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return { title: `${L[lang].title} | Deco-Land`, alternates: { canonical: `${SITE_URL}/${lang}/careers` } };
}

export default async function Careers({ params }: Props) {
  const { lang } = await params;
  if (!isCmsEnabled()) notFound();
  const cms = await renderCmsPage("careers", lang);
  if (cms) return cms;
  const ctx = await getBlockContext(lang);
  const t = L[lang];
  return (
    <>
      <JobsListBlock lang={lang} ctx={ctx} block={{ blockType: "jobsList", kicker: t.kicker, heading: t.title, text: t.lead }} />
      <section className="section--tight">
        <div className="wrap careers-apply">
          <h2>{t.apply}</h2>
          <p className="lead">{t.referral}</p>
          <ApplyForm lang={lang} />
        </div>
      </section>
    </>
  );
}
