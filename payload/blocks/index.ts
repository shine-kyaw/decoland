import type { Block } from "payload";
import { imageField, linkFields } from "../fields";

/*
  The page builder. Each block renders one designed section of the site
  (components/blocks/*), so staff can add, reorder and hide sections without
  being able to break the design. Text is localised (EN / MY); images,
  numbers and links are shared.
*/

const kicker = { name: "kicker", type: "text", localized: true, admin: { description: "Small label above the heading." } } as const;
const heading = { name: "heading", type: "text", localized: true } as const;
const text = { name: "text", type: "textarea", localized: true } as const;

export const HeroSlider: Block = {
  slug: "heroSlider",
  labels: { singular: "Hero slider", plural: "Hero sliders" },
  imageURL: "/img/hero-campus.jpg",
  fields: [
    {
      name: "slides",
      type: "array",
      minRows: 1,
      maxRows: 6,
      admin: { description: "Full-width photos that change every few seconds. The first slide's title is the page's main heading." },
      fields: [
        ...imageField("image", "Photo"),
        { name: "tab", type: "text", localized: true, admin: { description: "Short label under the slider, e.g. 'Warehouse'." } },
        kicker,
        { name: "title", type: "text", localized: true, required: true },
        text,
        { name: "focus", type: "select", defaultValue: "center", options: ["left", "center", "right"], admin: { description: "Which part of the photo to keep on narrow screens." } },
      ],
    },
    linkFields("primary", "Main button"),
    linkFields("secondary", "Second button"),
  ],
};

export const Stats: Block = {
  slug: "stats",
  labels: { singular: "Headline and figures", plural: "Headline and figures" },
  fields: [
    heading,
    { name: "items", type: "array", maxRows: 6, fields: [
      { type: "row", fields: [
        { name: "value", type: "text", required: true, admin: { width: "40%", description: "e.g. 1997, 25,000 m²" } },
        { name: "label", type: "text", localized: true, admin: { width: "60%" } },
      ] },
    ] },
  ],
};

export const ImageCards: Block = {
  slug: "imageCards",
  labels: { singular: "Image cards", plural: "Image cards" },
  fields: [
    kicker,
    heading,
    { name: "cards", type: "array", maxRows: 6, fields: [
      ...imageField("image", "Image"),
      { name: "title", type: "text", localized: true, required: true },
      text,
      { name: "tags", type: "text", localized: true, admin: { description: "Comma-separated, e.g. Copy, Printing, Packaging" } },
      linkFields("link", "Link"),
    ] },
  ],
};

export const CategoryGrid: Block = {
  slug: "categoryGrid",
  labels: { singular: "Product categories", plural: "Product categories" },
  fields: [
    kicker, heading, text,
    { name: "division", type: "select", options: ["paper", "stationery", "services"], admin: { description: "Show categories of one division, or leave empty for a hand-picked list." } },
    { name: "categories", type: "relationship", relationTo: "product-categories", hasMany: true, admin: { condition: (_, s) => !s?.division } },
    linkFields("link", "Button"),
  ],
};

export const LogoWall: Block = {
  slug: "logoWall",
  labels: { singular: "Brand logos", plural: "Brand logos" },
  fields: [kicker, heading, { name: "note", type: "text", localized: true, admin: { description: "Logos come from Catalogue → Brands (those marked 'distributed')." } }],
};

export const ProductRail: Block = {
  slug: "productRail",
  labels: { singular: "Product showcase", plural: "Product showcases" },
  fields: [
    kicker, heading, text,
    { name: "source", type: "select", defaultValue: "featured", options: [
      { label: "Featured products", value: "featured" },
      { label: "A category", value: "category" },
      { label: "Hand-picked", value: "picked" },
    ] },
    { name: "category", type: "relationship", relationTo: "product-categories", admin: { condition: (_, s) => s?.source === "category" } },
    { name: "products", type: "relationship", relationTo: "products", hasMany: true, admin: { condition: (_, s) => s?.source === "picked" } },
    ...imageField("banner", "Wide banner under the products"),
    linkFields("primary", "Main button"),
    linkFields("secondary", "Second button"),
  ],
};

export const Facility: Block = {
  slug: "facility",
  labels: { singular: "Facility (dark band)", plural: "Facility bands" },
  fields: [
    kicker, heading, text,
    { name: "points", type: "array", maxRows: 4, fields: [
      { type: "row", fields: [
        { name: "value", type: "text", required: true, admin: { width: "40%" } },
        { name: "label", type: "text", localized: true, admin: { width: "60%" } },
      ] },
    ] },
    ...imageField("main", "Main photo"),
    ...imageField("side1", "Side photo 1"),
    { name: "side1Caption", type: "text", localized: true },
    ...imageField("side2", "Side photo 2"),
    { name: "side2Caption", type: "text", localized: true },
  ],
};

export const ServicesGrid: Block = {
  slug: "servicesGrid",
  labels: { singular: "Services", plural: "Services" },
  fields: [
    kicker, heading, text,
    { name: "items", type: "array", maxRows: 6, fields: [...imageField("image", "Image"), { name: "title", type: "text", localized: true, required: true }, text] },
    linkFields("link", "Button"),
  ],
};

export const GroupStrip: Block = {
  slug: "groupStrip",
  labels: { singular: "Group companies", plural: "Group companies" },
  fields: [
    kicker, heading, text,
    { name: "photos", type: "array", maxRows: 4, fields: imageField("image", "Photo") },
    linkFields("link", "Link"),
  ],
};

export const VisionMission: Block = {
  slug: "visionMission",
  labels: { singular: "Vision and mission", plural: "Vision and mission" },
  fields: [
    { type: "row", fields: [
      { name: "visionLabel", type: "text", localized: true, defaultValue: "Vision" },
      { name: "missionLabel", type: "text", localized: true, defaultValue: "Mission" },
    ] },
    { name: "vision", type: "textarea", localized: true },
    { name: "mission", type: "textarea", localized: true },
  ],
};

export const ContactBand: Block = {
  slug: "contactBand",
  labels: { singular: "Contact band", plural: "Contact bands" },
  fields: [heading, text, { name: "showForm", type: "checkbox", label: "Show the enquiry form", defaultValue: false }],
};

export const TextImage: Block = {
  slug: "textImage",
  labels: { singular: "Text and image", plural: "Text and image" },
  fields: [
    kicker, heading,
    { name: "body", type: "richText", localized: true },
    ...imageField("image", "Image"),
    { name: "imageSide", type: "select", defaultValue: "right", options: ["left", "right"] },
    linkFields("link", "Button"),
  ],
};

export const RichTextBlock: Block = {
  slug: "richText",
  labels: { singular: "Text", plural: "Text" },
  fields: [{ name: "body", type: "richText", localized: true }],
};

export const Gallery: Block = {
  slug: "gallery",
  labels: { singular: "Photo gallery", plural: "Photo galleries" },
  fields: [kicker, heading, { name: "images", type: "array", fields: [...imageField("image", "Photo"), { name: "caption", type: "text", localized: true }] }],
};

export const CTA: Block = {
  slug: "cta",
  labels: { singular: "Call to action", plural: "Calls to action" },
  fields: [heading, text, linkFields("link", "Button"), { name: "style", type: "select", defaultValue: "green", options: ["green", "dark", "light"] }],
};

export const PostsList: Block = {
  slug: "postsList",
  labels: { singular: "Latest news", plural: "Latest news" },
  fields: [kicker, heading, { name: "category", type: "relationship", relationTo: "post-categories" }, { name: "limit", type: "number", defaultValue: 3 }],
};

export const JobsList: Block = {
  slug: "jobsList",
  labels: { singular: "Open jobs", plural: "Open jobs" },
  fields: [kicker, heading, text],
};

export const DownloadsList: Block = {
  slug: "downloadsList",
  labels: { singular: "Downloads", plural: "Downloads" },
  fields: [kicker, heading, { name: "category", type: "select", options: ["profile", "catalogue", "certificate"] }],
};

export const ProductGrid: Block = {
  slug: "productGrid",
  labels: { singular: "Product grid", plural: "Product grids" },
  fields: [
    kicker, heading, text,
    { name: "division", type: "select", options: ["paper", "stationery", "services"] },
    { name: "category", type: "relationship", relationTo: "product-categories" },
    { name: "showFilters", type: "checkbox", defaultValue: true },
  ],
};

// Sections are identified by their type ("Hero slider" etc.), so the optional
// per-section name box is switched off — it only ever showed "Untitled".
const named = (b: Block): Block => ({ ...b, admin: { ...b.admin, disableBlockName: true } });

export const allBlocks: Block[] = [
  HeroSlider, Stats, ImageCards, CategoryGrid, LogoWall, ProductRail, Facility, ServicesGrid,
  GroupStrip, VisionMission, ContactBand, TextImage, RichTextBlock, Gallery, CTA,
  PostsList, JobsList, DownloadsList, ProductGrid,
].map(named);
