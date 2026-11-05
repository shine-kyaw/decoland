import type { CollectionConfig, Field } from "payload";
import { isAdmin, isStaff } from "../access";
import { sendAlerts } from "../alerts";

/*
  The inbox. Rows are created only by the public forms (server side, through
  the Local API), never from the admin. Every signed-in role can read and
  work them; only admins can delete.
*/

const workflow: Field[] = [
  {
    name: "status",
    type: "select",
    defaultValue: "new",
    index: true,
    options: [
      { label: "New", value: "new" },
      { label: "Contacted", value: "contacted" },
      { label: "Quoted", value: "quoted" },
      { label: "Closed", value: "closed" },
    ],
    admin: { position: "sidebar" },
  },
  { name: "assignedTo", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
  {
    name: "notes",
    type: "array",
    labels: { singular: "Note", plural: "Internal notes" },
    admin: { description: "Visible to staff only." },
    fields: [
      { name: "text", type: "textarea", required: true },
      { name: "at", type: "date", defaultValue: () => new Date().toISOString(), admin: { readOnly: true } },
    ],
  },
];

const readOnly = { readOnly: true };

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  labels: { singular: "Enquiry", plural: "Enquiries" },
  admin: {
    group: "Inbox",
    useAsTitle: "name",
    defaultColumns: ["name", "company", "topic", "status", "assignedTo", "createdAt"],
    listSearchableFields: ["name", "company", "phone", "email", "message"],
    description: "Every enquiry from the website. Also sent by email, DingTalk and Telegram when those are set up.",
  },
  access: { read: isStaff, create: () => false, update: isStaff, delete: isAdmin },
  defaultSort: "-createdAt",
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === "create") await sendAlerts("enquiry", doc, req.payload);
        return doc;
      },
    ],
  },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { ...readOnly, width: "50%" } },
      { name: "company", type: "text", admin: { ...readOnly, width: "50%" } },
    ] },
    { type: "row", fields: [
      { name: "phone", type: "text", admin: { ...readOnly, width: "40%" } },
      { name: "viberOk", type: "checkbox", label: "Viber OK", admin: { ...readOnly, width: "20%" } },
      { name: "email", type: "email", admin: { ...readOnly, width: "40%" } },
    ] },
    { type: "row", fields: [
      { name: "customerType", type: "text", admin: { ...readOnly, width: "50%" } },
      { name: "topic", type: "text", admin: { ...readOnly, width: "50%" } },
    ] },
    { name: "product", type: "relationship", relationTo: "products", admin: readOnly },
    { name: "message", type: "textarea", admin: readOnly },
    { type: "row", fields: [
      { name: "sourcePage", type: "text", admin: { ...readOnly, width: "70%" } },
      { name: "lang", type: "text", admin: { ...readOnly, width: "30%" } },
    ] },
    ...workflow,
  ],
};

export const Applications: CollectionConfig = {
  slug: "applications",
  labels: { singular: "Job application", plural: "Job Applications" },
  admin: {
    group: "Inbox",
    useAsTitle: "name",
    defaultColumns: ["name", "job", "phone", "status", "createdAt"],
    listSearchableFields: ["name", "phone", "email"],
  },
  access: { read: isStaff, create: () => false, update: isStaff, delete: isAdmin },
  defaultSort: "-createdAt",
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === "create") await sendAlerts("application", doc, req.payload);
        return doc;
      },
    ],
  },
  fields: [
    { name: "job", type: "relationship", relationTo: "jobs", admin: readOnly },
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { ...readOnly, width: "34%" } },
      { name: "phone", type: "text", admin: { ...readOnly, width: "33%" } },
      { name: "email", type: "email", admin: { ...readOnly, width: "33%" } },
    ] },
    { name: "cv", type: "upload", relationTo: "private-files", label: "CV", admin: readOnly },
    { name: "message", type: "textarea", admin: readOnly },
    ...workflow,
  ],
};

/** CVs and other private uploads: readable by signed-in staff only, never public. */
export const PrivateFiles: CollectionConfig = {
  slug: "private-files",
  labels: { singular: "Private file", plural: "Private files" },
  admin: { group: "Inbox", hidden: true },
  access: { read: isStaff, create: () => false, update: isAdmin, delete: isAdmin },
  upload: { mimeTypes: ["application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], disableLocalStorage: true },
  fields: [],
};
