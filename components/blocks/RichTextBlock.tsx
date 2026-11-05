import { RichText } from "@payloadcms/richtext-lexical/react";
import type { BlockProps } from "@/lib/cms-types";

export function RichTextBlock({ block }: BlockProps) {
  if (!block.body) return null;
  return (
    <section className="section--tight">
      <div className="wrap">
        <div className="cms-prose cms-prose--narrow"><RichText data={block.body} /></div>
      </div>
    </section>
  );
}
