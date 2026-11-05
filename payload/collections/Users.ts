import type { CollectionConfig } from "payload";
import { adminField, hiddenUnlessAdmin } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
    removeTokenFromResponses: true,
    cookies: { sameSite: "Strict", secure: process.env.NODE_ENV === "production" },
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "updatedAt"],
    listSearchableFields: ["name", "email"],
    group: "Users",
    hideAPIURL: true,
    hidden: hiddenUnlessAdmin,
    description:
      "People who can sign in. Admin: everything. Editor: content, catalogue and media. Sales: enquiries and applications only. Five failed sign-ins lock an account for 15 minutes.",
  },
  access: {
    // Everyone signed in can see the team (to assign enquiries); only admins manage accounts.
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => (user as { role?: string } | null)?.role === "admin",
    update: ({ req: { user }, id }) =>
      (user as { role?: string } | null)?.role === "admin" || (Boolean(user) && String(id) === String(user?.id)),
    // Never delete the account you are signed in with.
    delete: ({ req: { user }, id }) =>
      (user as { role?: string } | null)?.role === "admin" && !(id && String(id) === String(user?.id)),
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      access: { update: adminField },
      options: [
        { label: "Administrator", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Sales", value: "sales" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
