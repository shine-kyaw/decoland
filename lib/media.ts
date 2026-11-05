import type { Locale } from "@/lib/site";

type Obj = Record<string, unknown>;

/** Resolve an upload (populated doc or url string) or fall back to a /public path. */
export function imgSrc(slot: unknown, fallback?: string | null): string | null {
  if (slot && typeof slot === "object") {
    const u = (slot as Obj).url;
    if (typeof u === "string" && u) return u;
  } else if (typeof slot === "string" && (slot.startsWith("/") || /^https?:/.test(slot))) {
    return slot;
  }
  return fallback || null;
}

export function imgAlt(slot: unknown, fallback = ""): string {
  if (slot && typeof slot === "object") {
    const a = (slot as Obj).alt;
    if (typeof a === "string" && a) return a;
  }
  return fallback;
}

/** Prefix internal paths with the locale; leave anchors, absolute urls and /api alone. */
export function localHref(url: string | null | undefined, lang: Locale): string {
  const u = (url ?? "").trim();
  if (!u) return "";
  if (u.startsWith("#") || /^(https?:|mailto:|tel:|viber:)/i.test(u)) return u;
  if (!u.startsWith("/")) return u;
  if (/^\/(en|my)(\/|$|\?|#)/.test(u) || u.startsWith("/api")) return u;
  return u === "/" ? `/${lang}` : `/${lang}${u}`;
}

/** Resolve a relationship that may be a populated doc or an id. */
export function relId(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === "object") { const id = (v as Obj).id; return id == null ? null : String(id); }
  return String(v);
}
