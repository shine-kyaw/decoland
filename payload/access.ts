import type { Access, FieldAccess } from "payload";

/*
  Three roles, set on each user:
    admin  — everything, including users and site settings
    editor — all content, catalogue, company pages and media; can read the inbox
    sales  — the inbox only (enquiries and job applications)
*/
export type Role = "admin" | "editor" | "sales";

type U = { role?: Role } | null | undefined;
const role = (user: unknown): Role | undefined => (user as U)?.role;

export const isAdmin: Access = ({ req: { user } }) => role(user) === "admin";
export const isEditor: Access = ({ req: { user } }) => role(user) === "admin" || role(user) === "editor";
export const isStaff: Access = ({ req: { user } }) => Boolean(user);
export const adminField: FieldAccess = ({ req: { user } }) => role(user) === "admin";

/** Public sees published versions only; signed-in staff see drafts too. */
export const publishedOrStaff: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: "published" } };

/** Hide a collection from the admin sidebar for people who can't use it. */
export const hiddenUnlessEditor = ({ user }: { user: unknown }) =>
  !(role(user) === "admin" || role(user) === "editor");
export const hiddenUnlessAdmin = ({ user }: { user: unknown }) => role(user) !== "admin";
