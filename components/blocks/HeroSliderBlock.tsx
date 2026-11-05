import { HeroSlider, type Slide } from "@/components/HeroSlider";
import { imgSrc, imgAlt, localHref } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";

const POS: Record<string, string> = { left: "18% 50%", center: "50% 50%", right: "70% 50%" };

export function HeroSliderBlock({ block, lang }: BlockProps) {
  const slides: Slide[] = [];
  for (const s of (block.slides ?? []) as Array<Record<string, any>>) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const src = imgSrc(s.image, s.imageSrc);
    if (!src) continue;
    slides.push({ src, alt: imgAlt(s.image, s.title ?? ""), tab: s.tab ?? "", kicker: s.kicker ?? "", title: s.title ?? "", text: s.text ?? "", position: POS[s.focus ?? "center"] ?? POS.center });
  }
  if (!slides.length) return null;
  const p = block.primary ?? {};
  const q = block.secondary ?? {};
  return (
    <HeroSlider
      slides={slides}
      cta={{ primary: { href: localHref(p.url, lang) || `/${lang}`, label: p.label ?? "" }, secondary: { href: localHref(q.url, lang) || `/${lang}`, label: q.label ?? "" } }}
    />
  );
}
