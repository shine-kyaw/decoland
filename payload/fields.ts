import type { Field } from "payload";

/*
  Shared field builders, so every collection speaks the same language.
*/

/**
 * An image slot with a built-in fallback (the KTK pattern): `<name>` is an
 * upload from the Media library, `<name>Src` is a path to a photo that ships
 * in /public/img. The site shows the upload when there is one, otherwise the
 * built-in file — so migrated photos work without filling the database.
 */
export function imageField(name: string, label: string, opts: { required?: boolean; description?: string } = {}): Field[] {
  return [
    {
      name,
      type: "upload",
      relationTo: "media",
      label,
      admin: { description: opts.description ?? "Upload or choose an image from the Media library." },
    },
    {
      name: `${name}Src`,
      type: "text",
      label: `${label} (built-in)`,
      admin: {
        description: "The photo this item came with. Used only when nothing is uploaded above.",
        condition: (_, sibling) => Boolean(sibling?.[`${name}Src`]),
      },
    },
  ];
}

/** URL slug, filled from the title when left empty, shown in the sidebar like WordPress's permalink. */
export function slugField(from = "title"): Field {
  return {
    name: "slug",
    type: "text",
    index: true,
    unique: true,
    admin: { position: "sidebar", description: "The web address of this item. Leave empty to create it from the title." },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          const src = (value as string) || (data?.[from] as string) || "";
          const s = String(typeof src === "object" ? (src as Record<string, string>).en ?? "" : src)
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return s || value;
        },
      ],
    },
  };
}

/** Manual ordering number, lower first. */
export const orderField: Field = {
  name: "order",
  type: "number",
  defaultValue: 100,
  admin: { position: "sidebar", description: "Lower numbers show first." },
};

/** A call-to-action link: either an internal page path or a full URL. */
export function linkFields(name = "link", label = "Button"): Field {
  return {
    name,
    type: "group",
    label,
    fields: [
      { type: "row", fields: [
        { name: "label", type: "text", localized: true, admin: { width: "50%" } },
        { name: "url", type: "text", admin: { width: "50%", description: "e.g. /paper, /contact#enquiry or https://…" } },
      ] },
    ],
  };
}
