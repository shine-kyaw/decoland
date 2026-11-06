"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Counts a page view per route change. No cookies, no identifiers (lib/analytics.ts). */
export function PageViewBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || navigator.webdriver) return;
    const body = JSON.stringify({ path: pathname });
    try {
      if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
        void fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
      }
    } catch {
      /* counting is best-effort */
    }
  }, [pathname]);
  return null;
}
