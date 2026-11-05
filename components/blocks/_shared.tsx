import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/site";
import { localHref } from "@/lib/media";
import type { LinkData } from "@/lib/cms-types";

/** A link from a {label, url} group; renders nothing when either is missing. */
export function CmsLink({ link, lang, className, children, tabIndex }: { link: LinkData; lang: Locale; className?: string; children?: React.ReactNode; tabIndex?: number }) {
  const label = link?.label?.trim();
  const href = link?.url ? localHref(link.url, lang) : "";
  if (!label || !href) return null;
  const inner = children ?? label;
  if (/^(https?:|mailto:|tel:|viber:)/i.test(href) || href.startsWith("/api")) {
    return <a className={className} href={href} rel="noopener" tabIndex={tabIndex}>{inner}</a>;
  }
  return <Link className={className} href={href} tabIndex={tabIndex}>{inner}</Link>;
}

export function Pic({ src, alt = "", w, h, sizes }: { src: string; alt?: string; w: number; h: number; sizes?: string }) {
  return <Image src={src} alt={alt} width={w} height={h} sizes={sizes} />;
}

export function titleOf(v: unknown): string {
  return v && typeof v === "object" ? String((v as { title?: string; name?: string }).title ?? (v as { name?: string }).name ?? "") : "";
}
