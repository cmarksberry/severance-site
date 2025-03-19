import { defineType } from "sanity";

export const quote = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  fields: [
    {
      name: "text",
      title: "Quote Text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "attribution",
      title: "Attribution",
      type: "string",
      description:
        "Who said this quote (e.g., 'Kier Eagan', 'Board of Directors')",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "context",
      title: "Context",
      type: "text",
      rows: 2,
      description: "Additional context about when or where this quote was said",
    },
  ],
  preview: {
    select: {
      text: "text",
      attribution: "attribution",
    },
    prepare: ({ text, attribution }) => {
      return {
        title: text?.substring(0, 50) + (text?.length > 50 ? "..." : ""),
        subtitle: `— ${attribution || "Unknown"}`,
      };
    },
  },
});
