import type { CollectionConfig } from "payload";
import { isEditor, isStaff, hiddenUnlessEditor } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Media item", plural: "Media Library" },
  admin: {
    group: "Media",
    hidden: hiddenUnlessEditor,
    description: "Images and documents. You can also upload straight from any image field while editing.",
    defaultColumns: ["filename", "alt", "mimeType", "updatedAt"],
  },
  access: { read: () => true, create: isStaff, update: isEditor, delete: isEditor },
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
    // Serverless hosts have no writable disk; sizes come from the Next image optimiser.
    disableLocalStorage: true,
  },
  fields: [
    { name: "alt", type: "text", localized: true, admin: { description: "A short description for screen readers and search engines." } },
    { name: "caption", type: "text", localized: true },
  ],
};
