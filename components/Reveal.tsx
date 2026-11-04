"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds .is-in to [data-reveal] elements as they enter the viewport. Content
 * is only hidden while the html element carries the .js class (set inline
 * in the layout), so nothing is lost if JavaScript never runs.
 */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    const showAll = () => els.forEach((el) => el.classList.add("is-in"));
    if (!("IntersectionObserver" in window)) {
      showAll();
      return;
    }
    // Anything already on screen shows at once, without waiting for a callback.
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => !el.classList.contains("is-in") && io.observe(el));
    // Safety net: never leave content hidden (print, find-in-page, odd browsers).
    const fallback = window.setTimeout(showAll, 4000);
    window.addEventListener("beforeprint", showAll);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
      window.removeEventListener("beforeprint", showAll);
    };
  }, [pathname]);
  return null;
}
