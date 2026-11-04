"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = { src: string; alt: string; tab: string; kicker: string; title: string; text: string; position?: string };

const DURATION = 6500;

/**
 * Full-width campus photo slider — the old site's LayerSlider hero, kept and
 * upgraded: crossfade with a slow zoom, labelled tabs with progress bars,
 * pauses on hover/focus and when the tab is hidden, no autoplay with
 * reduced motion. The first slide's title is the page h1.
 */
export function HeroSlider({ slides, cta }: { slides: Slide[]; cta: { primary: { href: string; label: string }; secondary: { href: string; label: string } } }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!auto || paused) return;
    timer.current = window.setTimeout(() => setI((n) => (n + 1) % slides.length), DURATION);
    return () => window.clearTimeout(timer.current);
  }, [i, auto, paused, slides.length]);

  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), [slides.length]);

  return (
    <section
      className="hero on-dark"
      aria-roledescription="carousel"
      data-paused={paused || !auto}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
      style={{ ["--dur" as string]: `${DURATION}ms` }}
    >
      <div className="hero__stage">
        {slides.map((s, n) => {
          const Title = n === 0 ? "h1" : "h2";
          return (
            <div key={s.src} className="slide" data-active={n === i} aria-hidden={n !== i} role="group" aria-roledescription="slide" aria-label={`${n + 1} / ${slides.length}`}>
              <div className="slide__img">
                <Image src={s.src} alt={s.alt} fill priority={n === 0} sizes="100vw" style={{ objectPosition: s.position || "center" }} />
              </div>
              <div className="wrap slide__copy">
                <p className="kicker">{s.kicker}</p>
                <Title>{s.title}</Title>
                <p className="text">{s.text}</p>
                <div className="hero__ctas">
                  <Link className="btn btn--yellow" href={cta.primary.href} tabIndex={n === i ? 0 : -1}>{cta.primary.label}</Link>
                  <Link className="btn btn--ghost" href={cta.secondary.href} tabIndex={n === i ? 0 : -1}>{cta.secondary.label}</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="hero__tabs">
        <div className="wrap" role="tablist">
          {slides.map((s, n) => (
            <button key={s.src} type="button" role="tab" className="hero__tab" aria-selected={n === i} onClick={() => go(n)}>
              <span className="hero__bar"><i key={`${n}-${i}`} className={!auto ? "static" : undefined} /></span>
              <span className="lbl">{String(n + 1).padStart(2, "0")} · {s.tab}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
