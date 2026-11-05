import type { CollectionConfig } from "payload";
import { isEditor, publishedOrStaff, hiddenUnlessEditor } from "../access";
import { imageField, slugField } from "../fields";
import { allBlocks } from "../blocks";

// Drafts, revisions and scheduled publishing, like WordPress's Publish box.
const versions = { drafts: { autosave: { interval: 3000 }, schedulePublish: true }, maxPerDoc: 30 } as const;

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Page", plural: "Pages" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    listSearchableFields: ["title", "slug"],
    hidden: hiddenUnlessEditor,
    description: "Website pages, built from sections. The page with the address 'home' is the home page.",
    preview: (doc, { locale }) => `/${locale || "en"}${doc?.slug && doc.slug !== "home" ? `/${doc.slug}` : ""}`,
  },
  versions,
  access: { read: publishedOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    {
      name: "layout",
      type: "blocks",
      label: "Page sections",
      blocks: allBlocks,
      admin: { initCollapsed: true, description: "Add, drag to reorder, or remove sections. Each section is pre-designed." },
    },
  ],
};

export const PostCategories: CollectionConfig = {
  slug: "post-categories",
  labels: { singular: "Post category", plural: "Post Categories" },
  admin: { group: "Content", useAsTitle: "title", hidden: hiddenUnlessEditor },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [{ name: "title", type: "text", localized: true, required: true }, slugField()],
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Post", plural: "News & CSR" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    listSearchableFields: ["title"],
    hidden: hiddenUnlessEditor,
    preview: (doc, { locale }) => `/${locale || "en"}/news/${doc?.slug ?? ""}`,
  },
  versions,
  access: { read: publishedOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: "-publishedAt",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    { name: "category", type: "relationship", relationTo: "post-categories", admin: { position: "sidebar" } },
    { name: "publishedAt", type: "date", admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } }, defaultValue: () => new Date().toISOString() },
    ...imageField("cover", "Cover photo"),
    { name: "excerpt", type: "textarea", localized: true, admin: { description: "One or two sentences for lists and sharing." } },
    { name: "body", type: "richText", localized: true },
    { name: "gallery", type: "array", fields: imageField("image", "Photo") },
  ],
};
