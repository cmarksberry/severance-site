import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { NewspaperIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { pageBuilderField } from "../common";

export const news = defineType({
  name: "news",
  title: "Lumon News",
  type: "document",
  icon: NewspaperIcon,
  groups: GROUPS,
  orderings: [orderRankOrdering],
  description:
    "Official Lumon news and updates. Share important announcements, policy changes, and department updates.",
  fields: [
    orderRankField({ type: "news" }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The headline of the news article",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A news title is required"),
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "text",
      rows: 3,
      description:
        "A brief summary of the news article (appears in search results)",
      group: GROUP.MAIN_CONTENT,
      validation: (rule) => [
        rule
          .min(140)
          .warning(
            "The meta description should be at least 140 characters for optimal SEO visibility",
          ),
        rule
          .max(160)
          .warning(
            "The meta description should not exceed 160 characters as it will be truncated",
          ),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL",
      description:
        "The web address where people can find this news article (automatically created from title)",
      group: GROUP.MAIN_CONTENT,
      components: {
        field: PathnameFieldComponent,
      },
      options: {
        source: "title",
        slugify: createSlug,
        isUnique,
      },
      validation: (Rule) => [
        Rule.required().error("A URL slug is required"),
        Rule.custom((value, context) => {
          if (!value?.current) return true;
          if (!value.current.startsWith("/news/")) {
            return 'URL slug must start with "/news/"';
          }
          return true;
        }),
      ],
    }),
    defineField({
      name: "department",
      type: "string",
      title: "Department",
      description: "Which Lumon department this news affects",
      options: {
        list: [
          { title: "MDR", value: "mdr" },
          { title: "O&D", value: "od" },
          { title: "Data Refinement", value: "data-refinement" },
          { title: "Corporate", value: "corporate" },
          { title: "All Departments", value: "all" },
        ],
      },
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      type: "string",
      title: "Priority Level",
      description: "The importance level of this news item",
      options: {
        list: [
          { title: "Critical", value: "critical" },
          { title: "Important", value: "important" },
          { title: "Standard", value: "standard" },
          { title: "Informational", value: "informational" },
        ],
      },
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "date",
      initialValue: () => new Date().toISOString().split("T")[0],
      title: "Published At",
      description: "The date when this news article will be published",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "image",
      title: "Image",
      description:
        "The main image that will appear at the top of the news article and in previews",
      type: "image",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    pageBuilderField,
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      media: "image",
      isPrivate: "seoNoIndex",
      hasPageBuilder: "pageBuilder",
    },
    prepare: ({ title, slug, media, isPrivate, hasPageBuilder }) => {
      const statusEmoji = isPrivate ? "🔒" : "🌎";
      const builderEmoji = hasPageBuilder?.length
        ? `🧱 ${hasPageBuilder.length}`
        : "🏗️";

      return {
        title: `${title || "Untitled Page"}`,
        subtitle: `${statusEmoji} ${builderEmoji} | 🔗 ${slug || "no-slug"}`,
        media,
      };
    },
  },
}); 