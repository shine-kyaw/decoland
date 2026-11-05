import type { GlobalConfig } from "payload";
import { isAdmin, isEditor, hiddenUnlessEditor } from "./access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: { group: "Settings", hidden: hiddenUnlessEditor, description: "Contact details, addresses and alerts used across the whole website." },
  access: { read: () => true, update: isEditor },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Contact",
          fields: [
            { type: "row", fields: [
              { name: "phone", type: "text", defaultValue: "+95 9 777 271999", admin: { width: "50%" } },
              { name: "viber", type: "text", defaultValue: "+959777271999", admin: { width: "50%", description: "Number used for the Viber button, digits only with country code." } },
            ] },
            { type: "row", fields: [
              { name: "email", type: "email", defaultValue: "marketing@decolandgroup.com", admin: { width: "50%" } },
              { name: "messenger", type: "text", defaultValue: "https://m.me/apolostio", admin: { width: "50%" } },
            ] },
            { name: "facebook", type: "text", defaultValue: "https://www.facebook.com/apolostio" },
            { name: "apoloShopUrl", type: "text", label: "APOLO online shop", defaultValue: "https://apolostationery.com" },
            { name: "showChatButton", type: "checkbox", label: "Show the floating Messenger / Viber chat button", defaultValue: true },
          ],
        },
        {
          label: "Addresses & hours",
          fields: [
            { name: "addresses", type: "array", fields: [
              { name: "label", type: "text", localized: true },
              { name: "name", type: "text", localized: true },
              { name: "address", type: "textarea", localized: true },
              { name: "mapUrl", type: "text" },
            ] },
            { name: "hours", type: "textarea", localized: true, admin: { description: "Opening hours, shown on the contact page." } },
          ],
        },
        {
          label: "Alerts",
          fields: [
            {
              name: "alertEmails",
              type: "array",
              labels: { singular: "Email", plural: "Alert emails" },
              access: { update: ({ req: { user } }) => (user as { role?: string } | null)?.role === "admin" },
              admin: { description: "Who gets emailed about new enquiries and job applications. DingTalk and Telegram are configured by Aster in the hosting settings." },
              fields: [{ name: "email", type: "email", required: true }],
            },
          ],
        },
      ],
    },
  ],
};

const navLink = [
  { type: "row" as const, fields: [
    { name: "label", type: "text" as const, localized: true, required: true, admin: { width: "50%" } },
    { name: "url", type: "text" as const, required: true, admin: { width: "50%", description: "e.g. /paper or /contact" } },
  ] },
];

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Menus",
  admin: { group: "Settings", hidden: hiddenUnlessEditor, description: "The header menu and footer links, like Appearance → Menus in WordPress." },
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: "header", type: "array", label: "Header menu", maxRows: 8, fields: navLink },
    { name: "footer", type: "array", label: "Footer links", maxRows: 12, fields: navLink },
  ],
};
