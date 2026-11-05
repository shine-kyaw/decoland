/* Loose shapes for CMS data used by the block renderers. Intentionally permissive. */
import type { Locale } from "@/lib/site";

export type Rel<T> = T | string | number | null | undefined;
export type MediaLike = { url?: string | null; alt?: string | null; filename?: string | null } | string | number | null | undefined;
export type LinkData = { label?: string | null; url?: string | null } | null | undefined;
export type ImageSlot = { [k: string]: unknown };

export type Brand = { id?: string | number; name?: string; logo?: MediaLike; logoSrc?: string | null; distributed?: boolean | null; order?: number | null };
export type Category = { id?: string | number; title?: string; slug?: string; division?: string | null; image?: MediaLike; imageSrc?: string | null; description?: string | null; order?: number | null };
export type Product = {
  id?: string | number; title?: string; slug?: string; category?: Rel<Category>; brand?: Rel<Brand>;
  images?: Array<{ image?: MediaLike; imageSrc?: string | null; [k: string]: unknown }> | null;
  summary?: string | null; featured?: boolean | null; order?: number | null;
};
export type GroupCompany = { id?: string | number; name?: string; logo?: MediaLike; logoSrc?: string | null; summary?: string | null; photo?: MediaLike; photoSrc?: string | null; website?: string | null };
export type Post = { id?: string | number; title?: string; slug?: string; category?: Rel<{ id?: string | number; title?: string; slug?: string }>; publishedAt?: string | null; cover?: MediaLike; coverSrc?: string | null; excerpt?: string | null };
export type Job = { id?: string | number; title?: string; slug?: string; department?: string | null; location?: string | null; type?: string | null; open?: boolean | null; closingDate?: string | null };
export type Download = { id?: string | number; title?: string; file?: MediaLike; category?: string | null; cover?: MediaLike; coverSrc?: string | null; order?: number | null };

export type BlockContext = {
  brands: Brand[];
  categories: Category[];
  products: Product[];
  groupCompanies: GroupCompany[];
  posts: Post[];
  jobs: Job[];
  downloads: Download[];
  settings: Record<string, unknown>;
};

export type BlockProps<B = Block> = { block: B; lang: Locale; ctx: BlockContext };

/** A block as stored: blockType plus whatever fields it has. */
export type Block = { id?: string | null; blockType: string; [k: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
