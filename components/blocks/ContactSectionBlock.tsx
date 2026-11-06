import { getContent } from "@/lib/dict";
import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { Channels } from "@/components/Channels";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Pic } from "./_shared";

export function ContactSectionBlock({ block, lang }: BlockProps) {
  const t = getContent(lang);
  const photo = imgSrc(block.image, block.imageSrc);
  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <div className="section-head">
            {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
            {block.heading ? <h2 data-reveal="mask">{block.heading}</h2> : null}
            {block.text ? <p className="lead">{block.text}</p> : null}
          </div>
          <Channels t={t} />
        </div>
      </section>
      <section className="section band-soft" id="enquiry">
        <div className="wrap two-col cform">
          <div className="cform__intro">
            {block.formTitle ? <h2 data-reveal="mask">{block.formTitle}</h2> : null}
            {block.formText ? <p className="lead">{block.formText}</p> : null}
            {photo ? <div className="cform__photo"><Pic src={photo} alt={imgAlt(block.image)} w={900} h={700} sizes="(max-width: 900px) 100vw, 45vw" /></div> : null}
          </div>
          <div className="cform__form"><EnquiryForm lang={lang} t={t.contact.form} /></div>
        </div>
      </section>
    </>
  );
}
