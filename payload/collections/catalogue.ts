import type { CollectionConfig } from "payload";
import { isEditor, publishedOrStaff, hiddenUnlessEditor } from "../access";
import { imageField, orderField, slugField } from "../fields";

const DIVISIONS = [
  { label: "Paper", value: "paper" },
  { label: "Stationery (APOLO)", value: "stationery" },
  { label: "Services", value: "services" },
];

export const ProductCategories: CollectionConfig = {
  slug: "product-categories",
  labels: { singular: "Product category", plural: "Product Categories" },
  admin: { group: "Catalogue", useAsTitle: "title", defaultColumns: ["title", "division", "order"], hidden: hiddenUnlessEditor },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    { name: "division", type: "select", required: true, options: DIVISIONS, admin: { position: "sidebar" } },
    orderField,
    { name: "description", type: "textarea", localized: true },
    ...imageField("image", "Category image"),
  ],
};

export const Brands: CollectionConfig = {
  slug: "brands",
  labels: { singular: "Brand", plural: "Brands" },
  admin: { group: "Catalogue", useAsTitle: "name", defaultColumns: ["name", "distributed", "order"], hidden: hiddenUnlessEditor },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    ...imageField("logo", "Logo"),
    { name: "distributed", type: "checkbox", defaultValue: true, label: "Show in 'Brands we carry'", admin: { position: "sidebar" } },
    orderField,
  ],
};

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product", plural: "Products" },
  admin: {
    group: "Catalogue",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "brand", "featured", "_status"],
    listSearchableFields: ["title", "slug"],
    hidden: hiddenUnlessEditor,
    description: "The product catalogue. There are no prices: each product has an 'Enquire about this' button.",
    preview: (doc, { locale }) => `/${locale || "en"}/products/${doc?.slug ?? ""}`,
  },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    { name: "category", type: "relationship", relationTo: "product-categories", required: true, admin: { position: "sidebar" } },
    { name: "brand", type: "relationship", relationTo: "brands", admin: { position: "sidebar" } },
    { name: "featured", type: "checkbox", label: "Featured on the home page", admin: { position: "sidebar" } },
    orderField,
    { name: "summary", type: "textarea", localized: true, admin: { description: "One or two lines shown on product cards." } },
    {
      name: "images",
      type: "array",
      labels: { singular: "Photo", plural: "Photos" },
      admin: { description: "The first photo is the main one." },
      fields: imageField("image", "Photo"),
    },
    {
      name: "specs",
      type: "array",
      labels: { singular: "Spec", plural: "Specifications" },
      admin: { description: "e.g. GSM · 70, Size · A4, Pages · 80, Pack · 12 pcs / dozen" },
      fields: [
        { type: "row", fields: [
          { name: "label", type: "text", localized: true, required: true, admin: { width: "40%" } },
          { name: "value", type: "text", localized: true, required: true, admin: { width: "60%" } },
        ] },
      ],
    },
    { name: "description", type: "richText", localized: true },
  ],
};
