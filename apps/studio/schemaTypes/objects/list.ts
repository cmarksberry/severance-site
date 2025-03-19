import { defineType } from "sanity";

export const list = defineType({
  name: "list",
  title: "List",
  type: "object",
  fields: [
    {
      name: "listType",
      title: "List Type",
      type: "string",
      options: {
        list: [
          { title: "Bullet", value: "bullet" },
          { title: "Numbered", value: "number" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "items",
      title: "List Items",
      type: "array",
      of: [{ type: "text" }],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      type: "listType",
      items: "items",
    },
    prepare: ({ type, items }) => {
      return {
        title: `${type === "bullet" ? "•" : "1."} ${items?.[0] || "Empty List"}`,
        subtitle: `${items?.length || 0} items`,
      };
    },
  },
});
