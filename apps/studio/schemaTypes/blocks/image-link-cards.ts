import { ImageIcon, ImagesIcon, UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField } from "../common";

const imageLinkCard = defineField({
  name: "imageLinkCard",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "Card Type",
      options: {
        list: [
          { title: "Custom Card", value: "custom" },
          { title: "Employee Card", value: "employee" },
        ],
      },
      initialValue: "custom",
    }),
    defineField({
      name: "employee",
      type: "reference",
      to: [{ type: "author" }],
      title: "Lumon Employee",
      description: "Select a Lumon employee to feature",
      hidden: ({ parent }) => parent?.type !== "employee",
      validation: (Rule) => Rule.required().when("type", "employee"),
    }),
    defineField({
      name: "title",
      title: "Card Title",
      type: "string",
      validation: (Rule) => Rule.required().when("type", "custom"),
      hidden: ({ parent }) => parent?.type === "employee",
    }),
    defineField({
      name: "description",
      title: "Card Description",
      type: "text",
      validation: (Rule) => Rule.required().when("type", "custom"),
      hidden: ({ parent }) => parent?.type === "employee",
    }),
    defineField({
      name: "image",
      title: "Card Image",
      type: "image",
      description: "Add an image or illustration for this card",
      hidden: ({ parent }) => parent?.type === "employee",
    }),
    defineField({
      name: "url",
      title: "Link URL",
      type: "customUrl",
      hidden: ({ parent }) => parent?.type === "employee",
    }),
  ],
  preview: {
    select: {
      type: "type",
      title: "title",
      description: "description",
      media: "image",
      employeeName: "employee.name",
      employeeImage: "employee.image",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare: ({
      type,
      title,
      description,
      media,
      employeeName,
      employeeImage,
      externalUrl,
      urlType,
      internalUrl,
      openInNewTab,
    }) => {
      if (type === "employee") {
        return {
          title: employeeName || "Unnamed Employee",
          subtitle: "Employee Card",
          media: employeeImage,
        };
      }

      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;
      const truncatedDesc =
        description?.length > 50
          ? `${description.substring(0, 50)}...`
          : description;

      return {
        title: title || "Untitled Card",
        subtitle:
          truncatedDesc + (url ? ` • ${truncatedUrl}${newTabIndicator}` : ""),
        media,
      };
    },
  },
});

export const imageLinkCards = defineType({
  name: "imageLinkCards",
  type: "object",
  icon: ImagesIcon,
  title: "Image Link Cards",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      description: "Optional text displayed above the title",
    }),
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "The main heading for this cards section",
      validation: (Rule) => Rule.required(),
    }),
    richTextField,
    buttonsField,
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [imageLinkCard],
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      cards: "cards",
    },
    prepare: ({ title, eyebrow, cards = [] }) => ({
      title: title || "Image Link Cards",
      subtitle: `${eyebrow ? `${eyebrow} • ` : ""}${cards.length} card${cards.length === 1 ? "" : "s"}`,
    }),
  },
});
