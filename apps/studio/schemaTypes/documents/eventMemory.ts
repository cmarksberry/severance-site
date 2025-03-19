import { CameraIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const eventMemory = defineType({
  name: "eventMemory",
  title: "Event Memory",
  type: "document",
  icon: CameraIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Memory Title",
      description: "A brief title for this memory",
      validation: (Rule) => Rule.required().error("Memory title is required"),
    }),
    defineField({
      name: "event",
      type: "reference",
      title: "Related Event",
      description: "The event this memory is from",
      to: [{ type: "event" }],
      validation: (Rule) => Rule.required().error("Related event is required"),
    }),
    defineField({
      name: "date",
      type: "datetime",
      title: "Memory Date",
      description: "When this memory was captured",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Memory Type",
      description: "The type of memory",
      options: {
        list: [
          { title: "Photo", value: "photo" },
          { title: "Video", value: "video" },
          { title: "Note", value: "note" },
          { title: "Achievement", value: "achievement" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "media",
      type: "image",
      title: "Photo/Video",
      description: "The photo or video for this memory",
      hidden: ({ parent }) => parent?.type === "note",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "content",
      type: "text",
      title: "Memory Content",
      description: "The text content of this memory",
      rows: 4,
      hidden: ({ parent }) => parent?.type === "photo",
    }),
    defineField({
      name: "contributor",
      type: "reference",
      title: "Contributor",
      description: "The employee who contributed this memory",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      description: "Keywords to help categorize this memory",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "mood",
      type: "string",
      title: "Mood",
      description: "The emotional tone of this memory",
      options: {
        list: [
          { title: "Joyful", value: "joyful" },
          { title: "Proud", value: "proud" },
          { title: "Reflective", value: "reflective" },
          { title: "Grateful", value: "grateful" },
          { title: "Excited", value: "excited" },
        ],
      },
    }),
    defineField({
      name: "protocolCompliance",
      type: "string",
      title: "Protocol Compliance",
      description: "Whether this memory follows Lumon protocols",
      options: {
        list: [
          { title: "Compliant", value: "compliant" },
          { title: "Needs Review", value: "needs-review" },
          { title: "Protocol Exception", value: "exception" },
        ],
      },
      initialValue: "compliant",
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      date: "date",
      media: "media",
      contributor: "contributor.name",
    },
    prepare: ({ title, type, date, media, contributor }) => {
      const typeEmoji = {
        photo: "📸",
        video: "🎥",
        note: "📝",
        achievement: "🏆",
      }[type || "note"];

      return {
        title: `${typeEmoji} ${title || "Untitled Memory"}`,
        subtitle: `📅 ${new Date(date).toLocaleDateString()} | 👤 ${contributor || "Anonymous"}`,
        media,
      };
    },
  },
});
