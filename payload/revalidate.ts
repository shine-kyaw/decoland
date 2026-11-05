import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

// The website caches every CMS read under the "cms" tag (lib/cms.ts), and
// product and news pages are pre-rendered at build time. Without this, an edit
// would not appear until the cache expired or the next deploy.
//
// Every save therefore drops the whole CMS cache and every rendered page. That
// is the right trade-off at Deco-Land's size: the site is a couple of dozen pages,
// and content such as the phone number appears on every one of them via the
// footer, so a narrower refresh would miss things.
//
// These only work inside a Next.js request. The seed script runs Payload
// outside one, so failures there are expected and ignored.
const CMS_CACHE_TAG = "cms";

function refreshSite() {
  try {
    // Next 16: expire immediately so the next visit reads fresh content.
    revalidateTag(CMS_CACHE_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  } catch {
    // Not inside a Next.js request (e.g. the seed script) — nothing to refresh.
  }
}

export const refreshAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  refreshSite();
  return doc;
};

export const refreshAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  refreshSite();
  return doc;
};

export const refreshAfterGlobalChange: GlobalAfterChangeHook = ({ doc }) => {
  refreshSite();
  return doc;
};
