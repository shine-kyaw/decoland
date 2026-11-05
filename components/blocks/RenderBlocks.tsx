import type { ReactNode } from "react";
import type { Locale } from "@/lib/site";
import type { Block, BlockContext, BlockProps } from "@/lib/cms-types";
import { HeroSliderBlock } from "./HeroSliderBlock";
import { StatsBlock } from "./StatsBlock";
import { ImageCardsBlock } from "./ImageCardsBlock";
import { CategoryGridBlock } from "./CategoryGridBlock";
import { LogoWallBlock } from "./LogoWallBlock";
import { ProductRailBlock } from "./ProductRailBlock";
import { FacilityBlock } from "./FacilityBlock";
import { ServicesGridBlock } from "./ServicesGridBlock";
import { GroupStripBlock } from "./GroupStripBlock";
import { VisionMissionBlock } from "./VisionMissionBlock";
import { ContactBandBlock } from "./ContactBandBlock";
import { TextImageBlock } from "./TextImageBlock";
import { RichTextBlock } from "./RichTextBlock";
import { GalleryBlock } from "./GalleryBlock";
import { CtaBlock } from "./CtaBlock";
import { PostsListBlock } from "./PostsListBlock";
import { JobsListBlock } from "./JobsListBlock";
import { DownloadsListBlock } from "./DownloadsListBlock";
import { ProductGridBlock } from "./ProductGridBlock";

type Renderer = (props: BlockProps) => ReactNode;

const MAP: Record<string, Renderer> = {
  heroSlider: HeroSliderBlock,
  stats: StatsBlock,
  imageCards: ImageCardsBlock,
  categoryGrid: CategoryGridBlock,
  logoWall: LogoWallBlock,
  productRail: ProductRailBlock,
  facility: FacilityBlock,
  servicesGrid: ServicesGridBlock,
  groupStrip: GroupStripBlock,
  visionMission: VisionMissionBlock,
  contactBand: ContactBandBlock,
  textImage: TextImageBlock,
  richText: RichTextBlock,
  gallery: GalleryBlock,
  cta: CtaBlock,
  postsList: PostsListBlock,
  jobsList: JobsListBlock,
  downloadsList: DownloadsListBlock,
  productGrid: ProductGridBlock,
};

export function RenderBlocks({ blocks, lang, ctx }: { blocks: Block[] | null | undefined; lang: Locale; ctx: BlockContext }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block, n) => {
        const Comp = MAP[block.blockType];
        if (!Comp) return null;
        return <Comp key={block.id ?? `${block.blockType}-${n}`} block={block} lang={lang} ctx={ctx} />;
      })}
    </>
  );
}
