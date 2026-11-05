"use client";

import { useNav } from "@payloadcms/ui";
import React, { useEffect } from "react";

/*
  WordPress always shows its sidebar on a desktop. Payload hard-codes 1440px
  as the width below which the sidebar starts closed, which would hide it on
  most office laptops (1366 / 1440 wide). This reopens it on any screen at
  least 1024px wide, after Payload's own breakpoint effect has run.
*/
export function KeepNavOpen({ children }: { children?: React.ReactNode }) {
  const { setNavOpen } = useNav();
  useEffect(() => {
    const open = () => {
      if (window.innerWidth >= 1024) setNavOpen(true);
    };
    // Payload's NavProvider closes the nav in its own effect, which runs after
    // ours (parents' effects run after children's), so defer one tick.
    const t = window.setTimeout(open, 0);
    const mq = window.matchMedia("(min-width: 1024px)");
    mq.addEventListener("change", open);
    return () => {
      window.clearTimeout(t);
      mq.removeEventListener("change", open);
    };
  }, [setNavOpen]);
  return <>{children}</>;
}
