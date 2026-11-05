import { Channels } from "@/components/Channels";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getContent } from "@/lib/dict";
import type { BlockProps } from "@/lib/cms-types";

export function ContactBandBlock({ block, lang }: BlockProps) {
  const t = getContent(lang);
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="contact-band on-dark">
          <div>
            {block.heading ? <h2>{block.heading}</h2> : null}
            {block.text ? <p>{block.text}</p> : null}
          </div>
          <Channels t={t} />
        </div>
        {block.showForm ? (
          <div id="enquiry" style={{ marginTop: 32 }}>
            <EnquiryForm lang={lang} t={t.contact.form} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
