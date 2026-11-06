import Image from "next/image";
import { imgSrc, imgAlt } from "@/lib/media";
import type { BlockProps } from "@/lib/cms-types";
import { CmsLink } from "./_shared";

const POS: Record<string, string> = { left: "18% 50%", center: "50% 50%", right: "70% 50%" };

export function PageHeaderBlock({ block, lang }: BlockProps) {
  if (!block.title) return null;
  const src = imgSrc(block.image, block.imageSrc);
  const copy = (dark: boolean) => (
    <>
      {block.kicker ? <p className="kicker">{block.kicker}</p> : null}
      <h1>{block.title}</h1>
      {block.lead ? <p className="lead">{block.lead}</p> : null}
      {block.primary?.label || block.secondary?.label ? (
        <div className="btns">
          <CmsLink link={block.primary} lang={lang} className={dark ? "btn btn--yellow" : "btn"} />
          <CmsLink link={block.secondary} lang={lang} className="btn btn--ghost" />
        </div>
      ) : null}
    </>
  );
  if (!src) {
    return (
      <header className="phdr phdr--light">
        <div className="wrap page-head">{copy(false)}</div>
      </header>
    );
  }
  return (
    <header className="phdr on-dark">
      <Image src={src} alt={imgAlt(block.image)} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: POS[block.focus ?? "center"] ?? POS.center }} />
      <div className="phdr__shade" aria-hidden="true" />
      <div className="wrap phdr__copy">{copy(true)}</div>
    </header>
  );
}
