import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { list } from "../objects/list";
import { quote } from "../objects/quote";

type ImportanceLevel = "critical" | "essential" | "important" | "supplementary";
type Category = "core-values" | "teachings" | "principles" | "historical" | "protocols";

const IMPORTANCE_EMOJI: Record<ImportanceLevel, string> = {
  critical: "🔴",
  essential: "🟡",
  important: "🟢",
  supplementary: "⚪",
};

const CATEGORY_EMOJI: Record<Category, string> = {
  "core-values": "💎",
  teachings: "📚",
  principles: "⚖️",
  historical: "📜",
  protocols: "📋",
};

export const kierKnowledge = defineType({
  name: "kierKnowledge",
  title: "Kier's Knowledge",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The title of this knowledge entry",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description: "URL-friendly version of the title",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      description: "The category of this knowledge entry",
      options: {
        list: [
          { title: "Core Values", value: "core-values" },
          { title: "Teachings", value: "teachings" },
          { title: "Principles", value: "principles" },
          { title: "Historical Records", value: "historical" },
          { title: "Protocols", value: "protocols" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      description: "The main content of this knowledge entry",
      of: [
        { type: "block" },
        { type: "image" },
        { type: "list" },
        { type: "quote" },
      ],
    }),
    defineField({
      name: "keyQuotes",
      type: "array",
      title: "Key Quotes",
      description: "Important quotes from Kier related to this entry",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "quote",
              type: "text",
              title: "Quote",
              rows: 2,
            },
            {
              name: "context",
              type: "text",
              title: "Context",
              description: "Where this quote comes from or its significance",
              rows: 2,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "relatedValues",
      type: "array",
      title: "Related Values",
      description: "Core values that this knowledge entry relates to",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "value",
              type: "string",
              title: "Value",
              options: {
                list: [
                  { title: "Integrity", value: "integrity" },
                  { title: "Dedication", value: "dedication" },
                  { title: "Excellence", value: "excellence" },
                  { title: "Innovation", value: "innovation" },
                  { title: "Community", value: "community" },
                ],
              },
            },
            {
              name: "explanation",
              type: "text",
              title: "Explanation",
              description: "How this value relates to the knowledge entry",
              rows: 2,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "importance",
      type: "string",
      title: "Importance Level",
      description: "The importance level of this knowledge entry",
      options: {
        list: [
          { title: "Critical", value: "critical" },
          { title: "Essential", value: "essential" },
          { title: "Important", value: "important" },
          { title: "Supplementary", value: "supplementary" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "requiredForDepartments",
      type: "array",
      title: "Required For Departments",
      description: "Departments that must be familiar with this knowledge",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "MDR", value: "mdr" },
          { title: "O&D", value: "od" },
          { title: "Data Refinement", value: "data-refinement" },
          { title: "Corporate", value: "corporate" },
          { title: "Security", value: "security" },
          { title: "Wellness", value: "wellness" },
        ],
      },
    }),
    defineField({
      name: "lastUpdated",
      type: "datetime",
      title: "Last Updated",
      description: "When this knowledge entry was last updated",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      importance: "importance",
      media: "content.0",
    },
    prepare: ({ title, category, importance, media }) => {
      const importanceEmoji = importance ? IMPORTANCE_EMOJI[importance as ImportanceLevel] : "⚪";
      const categoryEmoji = category ? CATEGORY_EMOJI[category as Category] : "📚";

      return {
        title: `${importanceEmoji} ${title || "Untitled Knowledge"}`,
        subtitle: `${categoryEmoji} ${category ? category.replace("-", " ").toUpperCase() : "Uncategorized"}`,
        media,
      };
    },
  },
}); 