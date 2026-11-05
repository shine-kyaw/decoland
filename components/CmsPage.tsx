import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { getBlockContext, getPage } from "@/lib/cms";
import type { Locale } from "@/lib/site";
import type { Block } from "@/lib/cms-types";

/**
 * The CMS version of a page, or null when the CMS is off, has no published
 * page with this address, or the page has no sections yet. Callers render
 * their built-in page when this returns null.
 */
export async function renderCmsPage(slug: string, lang: Locale) {
  const page = await getPage(slug, lang);
  const blocks = (page?.layout as Block[] | undefined) ?? [];
  if (!blocks.length) return null;
  const ctx = await getBlockContext(lang);
  return <RenderBlocks blocks={blocks} lang={lang} ctx={ctx} />;
}
