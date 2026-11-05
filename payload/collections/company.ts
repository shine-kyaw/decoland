import type { CollectionConfig } from "payload";
import { isEditor, publishedOrStaff, hiddenUnlessEditor } from "../access";
import { imageField, orderField, slugField } from "../fields";

export const GroupCompanies: CollectionConfig = {
  slug: "group-companies",
  labels: { singular: "Group company", plural: "Group Companies" },
  admin: { group: "Company", useAsTitle: "name", defaultColumns: ["name", "order"], hidden: hiddenUnlessEditor },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    { name: "summary", type: "textarea", localized: true },
    ...imageField("logo", "Logo"),
    ...imageField("photo", "Photo"),
    { name: "website", type: "text" },
    orderField,
  ],
};

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Job", plural: "Jobs" },
  admin: { group: "Company", useAsTitle: "title", defaultColumns: ["title", "department", "open", "closingDate"], hidden: hiddenUnlessEditor },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 10 },
  access: { read: publishedOrStaff, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    { type: "row", fields: [
      { name: "department", type: "text", localized: true },
      { name: "location", type: "text", localized: true, defaultValue: "Yangon" },
      { name: "type", type: "select", defaultValue: "full-time", options: ["full-time", "part-time", "contract", "internship"] },
    ] },
    { name: "open", type: "checkbox", defaultValue: true, label: "Accepting applications", admin: { position: "sidebar" } },
    { name: "closingDate", type: "date", admin: { position: "sidebar" } },
    { name: "description", type: "richText", localized: true },
  ],
};

export const Downloads: CollectionConfig = {
  slug: "downloads",
  labels: { singular: "Download", plural: "Downloads" },
  admin: { group: "Company", useAsTitle: "title", defaultColumns: ["title", "category", "order"], hidden: hiddenUnlessEditor },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "category", type: "select", defaultValue: "catalogue", options: [
      { label: "Company profile", value: "profile" },
      { label: "Catalogue", value: "catalogue" },
      { label: "Certificate", value: "certificate" },
    ] },
    { name: "file", type: "upload", relationTo: "media", required: true },
    ...imageField("cover", "Cover image"),
    orderField,
  ],
};
