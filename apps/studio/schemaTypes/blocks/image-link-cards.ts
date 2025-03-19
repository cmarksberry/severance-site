import { ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";

export const imageLinkCards = defineType({
  name: "imageLinkCards",
  title: "Image Link Cards",
  type: "object",
  icon: ImageIcon,
  description:
    "A grid of cards with images and links. Each card can have its own image, title, description, and link.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The main heading for this section",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A title is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A brief description of this section",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "cards",
      type: "array",
      title: "Cards",
      description: "The cards to display in this section",
      group: GROUP.MAIN_CONTENT,
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              type: "image",
              title: "Image",
              description: "The image to display on this card",
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: "title",
              type: "string",
              title: "Title",
              description: "The title of this card",
              validation: (Rule) =>
                Rule.required().error("A title is required"),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
              description: "A brief description of this card",
              rows: 2,
            }),
            defineField({
              name: "link",
              type: "object",
              title: "Link",
              description: "The link for this card",
              fields: [
                defineField({
                  name: "text",
                  type: "string",
                  title: "Link Text",
                  description: "The text to display for the link",
                  validation: (Rule) =>
                    Rule.required().error("Link text is required"),
                }),
                defineField({
                  name: "href",
                  type: "string",
                  title: "Link URL",
                  description: "The URL to link to",
                  validation: (Rule) =>
                    Rule.required().error("Link URL is required"),
                }),
              ],
            }),
          ],
        },
      ],
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      cards: "cards",
    },
    prepare: ({ title, cards }) => {
      return {
        title: title || "Image Link Cards",
        subtitle: `${cards?.length || 0} cards`,
      };
    },
  },
});
