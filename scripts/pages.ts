/*
  Inner pages as page-builder sections, built from the site's existing copy
  (lib/content.*.ts) so English and Burmese stay in step. Used by seed.ts.
  Each function returns the same structure for both languages; seed.ts
  creates the English page and then fills in Burmese on the same rows.
*/
import type { Content } from "../lib/content.en";

type Any = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const enquire = "/contact#enquiry";

/** Minimal Lexical document from plain paragraphs. */
export function lexical(paragraphs: string[]) {
  return {
    root: {
      type: "root", version: 1, format: "", indent: 0, direction: "ltr",
      children: paragraphs.map((t) => ({
        type: "paragraph", version: 1, format: "", indent: 0, direction: "ltr", textFormat: 0,
        children: [{ type: "text", version: 1, text: t, format: 0, detail: 0, mode: "normal", style: "" }],
      })),
    },
  };
}

export function about(t: Content): Any[] {
  const a = t.about;
  const h = t.home;
  return [
    { blockType: "pageHeader", kicker: a.kicker, title: a.h1, lead: a.lead, imageSrc: "/img/hero-entrance.jpg", focus: "left",
      primary: { label: h.ctaPrimary, url: enquire }, secondary: { label: h.groupCta, url: "/group" } },
    { blockType: "textImage", kicker: a.kicker, heading: a.storyTitle, body: lexical(a.story), imageSrc: "/img/campus-aerial.jpg", imageSide: "right" },
    { blockType: "stats", heading: h.statement, items: h.proof.map((p) => ({ value: p.k, label: p.label })) },
    { blockType: "timeline", kicker: a.kicker, heading: a.timelineTitle, items: a.timeline.map((m) => ({ year: m.year, text: m.text })) },
    { blockType: "facility", kicker: h.facilityKicker, heading: h.facilityTitle, text: h.facilityText,
      points: h.facilityPoints.map((p) => ({ value: p.k, label: p.label })),
      mainSrc: "/img/hero-campus.jpg", side1Src: "/img/warehouse.jpg", side1Caption: h.slides[3].tab, side2Src: "/img/hero-gate.jpg", side2Caption: h.slides[2].tab },
    { blockType: "visionMission", visionLabel: a.visionTitle, missionLabel: a.missionTitle, vision: a.vision, mission: a.mission },
    { blockType: "groupStrip", kicker: h.groupKicker, heading: h.groupTitle, text: h.groupText,
      photos: [{ imageSrc: "/img/moderntech.jpg" }, { imageSrc: "/img/tbsp-team.jpg" }], link: { label: h.groupCta, url: "/group" } },
    { blockType: "cta", heading: a.ctaTitle, text: a.ctaText, link: { label: h.ctaPrimary, url: enquire }, style: "green" },
  ];
}

export function paper(t: Content): Any[] {
  const p = t.paper;
  const h = t.home;
  return [
    { blockType: "pageHeader", kicker: p.kicker, title: p.h1, lead: p.lead, imageSrc: "/img/warehouse.jpg", focus: "center",
      primary: { label: h.ctaPrimary, url: enquire } },
    { blockType: "categoryDetails", kicker: h.catalogueKicker, heading: h.catalogueTitle, text: p.note, division: "paper", display: "chips" },
    { blockType: "textImage", kicker: p.copyTitle, heading: h.slides[2].title, body: lexical([p.copyText]), imageSrc: "/img/brands/paper-one.jpg", imageSide: "left" },
    { blockType: "logoWall", kicker: h.brandsKicker, heading: h.brandsTitle },
    { blockType: "cta", heading: p.ctaTitle, text: p.ctaText, link: { label: h.ctaPrimary, url: enquire }, style: "dark" },
  ];
}

export function stationery(t: Content, apoloUrl: string): Any[] {
  const s = t.stationery;
  const h = t.home;
  return [
    { blockType: "pageHeader", kicker: s.kicker, title: s.h1, lead: s.lead, imageSrc: "/img/apolo-range.jpg", focus: "center",
      primary: { label: s.shopCta, url: apoloUrl }, secondary: { label: h.ctaPrimary, url: enquire } },
    { blockType: "productRail", kicker: h.apoloKicker, heading: h.apoloTitle, text: h.apoloText, source: "featured",
      primary: { label: s.shopCta, url: apoloUrl } },
    { blockType: "categoryDetails", kicker: s.kicker, heading: s.familiesTitle, division: "stationery", display: "cards" },
    { blockType: "cta", heading: s.forBuyersTitle, text: s.forBuyersText, link: { label: h.ctaPrimary, url: enquire }, style: "green" },
  ];
}

export function services(t: Content): Any[] {
  const s = t.services;
  const h = t.home;
  const imgs = ["/img/svc-cups.jpg", "/img/svc-custom-print.jpg", "/img/svc-packaging.jpg"];
  return [
    { blockType: "pageHeader", kicker: s.kicker, title: s.h1, lead: s.lead, imageSrc: "/img/svc-packaging.jpg", focus: "right",
      primary: { label: h.ctaPrimary, url: enquire } },
    { blockType: "servicesGrid", kicker: h.servicesKicker, heading: h.servicesTitle, text: h.servicesText,
      items: s.blocks.map((b, i) => ({ imageSrc: imgs[i], title: b.title, text: b.text, points: b.list.join("\n") })) },
    { blockType: "steps", kicker: s.kicker, heading: s.processTitle, text: s.processLead, items: s.steps.map((x) => ({ title: x })) },
    { blockType: "gallery", kicker: h.servicesKicker, heading: h.services[0].title,
      images: [{ imageSrc: "/img/svc-disposables.jpg" }, { imageSrc: "/img/svc-cups.jpg" }, { imageSrc: "/img/svc-packaging.jpg" }] },
    { blockType: "cta", heading: s.ctaTitle, text: s.ctaText, link: { label: h.ctaPrimary, url: enquire }, style: "green" },
  ];
}

export function group(t: Content): Any[] {
  const g = t.group;
  const h = t.home;
  return [
    { blockType: "pageHeader", kicker: g.kicker, title: g.h1, lead: g.lead, imageSrc: "/img/hero-campus.jpg", focus: "center" },
    { blockType: "companies", kicker: h.groupKicker, heading: h.groupTitle, text: h.groupText, note: g.note },
    { blockType: "gallery", kicker: h.groupKicker, heading: g.h1,
      images: [{ imageSrc: "/img/moderntech.jpg" }, { imageSrc: "/img/tbsp-team.jpg" }, { imageSrc: "/img/mainlabel-products.jpg" }, { imageSrc: "/img/hitachi-projects.jpg" }] },
    { blockType: "contactBand", heading: h.contactTitle, text: h.contactText, showForm: false },
  ];
}

export function contact(t: Content): Any[] {
  const c = t.contact;
  return [
    { blockType: "pageHeader", kicker: c.kicker, title: c.h1, lead: c.lead, imageSrc: "/img/hero-gate.jpg", focus: "right" },
    { blockType: "contactSection", kicker: c.kicker, heading: c.channelsTitle, formTitle: c.formTitle, formText: c.formLead, imageSrc: "/img/signage.jpg" },
    { blockType: "places", kicker: c.kicker, heading: c.placesTitle, showHours: true },
  ];
}
