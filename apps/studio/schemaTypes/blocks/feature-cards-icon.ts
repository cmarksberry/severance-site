import { LayoutGrid } from "lucide-react";
import { defineField } from "sanity";
import { defineType } from "sanity";

const featureCardIcon = defineField({
  name: "featureCardIcon",
  type: "object",
  fields: [
    defineField({
      name: "employee",
      type: "reference",
      to: [{ type: "author" }],
      title: "Lumon Employee",
      description: "Select a Lumon employee to feature",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "highlight",
      type: "string",
      title: "Key Achievement",
      description: "A notable achievement or contribution by this employee",
    }),
  ],
  preview: {
    select: {
      title: "employee.name",
      subtitle: "highlight",
      media: "employee.image",
    },
    prepare: ({ title, subtitle, media }) => {
      return {
        title: title ?? "Unnamed Employee",
        subtitle: subtitle ?? "No highlight specified",
        media,
      };
    },
  },
});

export const featureCardsIcon = defineType({
  name: "featureCardsIcon",
  type: "object",
  icon: LayoutGrid,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Section Eyebrow",
      description: "A short text that appears above the section title",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Section Title",
      description: "The main title for this section of employee features",
    }),
    defineField({
      name: "cards",
      type: "array",
      of: [featureCardIcon],
      title: "Featured Employees",
      description: "Select Lumon employees to feature in this section",
    }),
  ],
  preview: {
    select: {
      title: "title",
      cards: "cards",
    },
    prepare: ({ title, cards }) => ({
      title: title ?? "Featured Employees",
      subtitle: `${cards?.length ?? 0} employee${cards?.length === 1 ? "" : "s"} featured`,
    }),
  },
});
