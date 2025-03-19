import { CalendarIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Lumon Event",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Event Title",
      description:
        "The name of the event (e.g., 'Melon Bar Celebration', 'Waffle Party')",
      validation: (Rule) => Rule.required().error("Event title is required"),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Event Type",
      description: "The category of event",
      options: {
        list: [
          { title: "Food Celebration", value: "food" },
          { title: "Department Milestone", value: "milestone" },
          { title: "Protocol Achievement", value: "protocol" },
          { title: "Quarterly Review", value: "review" },
          { title: "Special Occasion", value: "special" },
          { title: "Wellness Session", value: "wellness" },
          { title: "Team Building", value: "team-building" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "department",
      type: "string",
      title: "Department",
      description: "Which department(s) this event is for",
      options: {
        list: [
          { title: "MDR", value: "mdr" },
          { title: "O&D", value: "od" },
          { title: "Data Refinement", value: "data-refinement" },
          { title: "Corporate", value: "corporate" },
          { title: "All Departments", value: "all" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      type: "datetime",
      title: "Event Date & Time",
      description: "When the event will take place",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      title: "Location",
      description: "Where the event will be held",
      options: {
        list: [
          { title: "Break Room", value: "break-room" },
          { title: "Conference Room", value: "conference-room" },
          { title: "Department Floor", value: "department-floor" },
          { title: "Lumon Cafeteria", value: "cafeteria" },
          { title: "Wellness Room", value: "wellness-room" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Details about the event and what to expect",
      rows: 3,
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Event Image",
      description: "A photo or illustration representing the event",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "foodItems",
      type: "array",
      title: "Food Items",
      description:
        "List of food items that will be served (for food celebrations)",
      hidden: ({ parent }) => parent?.type !== "food",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              type: "string",
              title: "Item Name",
            },
            {
              name: "description",
              type: "text",
              title: "Description",
              rows: 1,
            },
            {
              name: "quantity",
              type: "number",
              title: "Quantity",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "milestoneDetails",
      type: "object",
      title: "Milestone Details",
      description: "Details about the milestone being celebrated",
      hidden: ({ parent }) => parent?.type !== "milestone",
      fields: [
        {
          name: "achievement",
          type: "string",
          title: "Achievement",
        },
        {
          name: "metrics",
          type: "text",
          title: "Metrics",
          rows: 2,
        },
        {
          name: "impact",
          type: "text",
          title: "Impact",
          rows: 2,
        },
      ],
    }),
    defineField({
      name: "protocolDetails",
      type: "object",
      title: "Protocol Details",
      description: "Details about the protocol achievement",
      hidden: ({ parent }) => parent?.type !== "protocol",
      fields: [
        {
          name: "protocolName",
          type: "string",
          title: "Protocol Name",
        },
        {
          name: "completionLevel",
          type: "string",
          title: "Completion Level",
          options: {
            list: [
              { title: "Bronze", value: "bronze" },
              { title: "Silver", value: "silver" },
              { title: "Gold", value: "gold" },
              { title: "Diamond", value: "diamond" },
            ],
          },
        },
        {
          name: "description",
          type: "text",
          title: "Description",
          rows: 2,
        },
      ],
    }),
    defineField({
      name: "requirements",
      type: "array",
      title: "Requirements",
      description: "Any special requirements or items needed for the event",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "attendance",
      type: "string",
      title: "Attendance",
      description: "Who is expected to attend",
      options: {
        list: [
          { title: "Mandatory", value: "mandatory" },
          { title: "Optional", value: "optional" },
          { title: "Department Heads Only", value: "heads-only" },
        ],
      },
      initialValue: "optional",
    }),
    defineField({
      name: "protocolNotes",
      type: "text",
      title: "Protocol Notes",
      description:
        "Any specific protocols or procedures to follow during the event",
      rows: 2,
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      description: "Current status of the event",
      options: {
        list: [
          { title: "Scheduled", value: "scheduled" },
          { title: "In Progress", value: "in-progress" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "scheduled",
    }),
    defineField({
      name: "memories",
      type: "array",
      title: "Event Memories",
      description: "Memories and photos from the event",
      of: [{ type: "reference", to: [{ type: "eventMemory" }] }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      department: "department",
      date: "date",
      status: "status",
      media: "image",
    },
    prepare: ({ title, type, department, date, status, media }) => {
      // Create a Severance-themed subtitle
      const deptInfo = department ? `🏢 ${department.toUpperCase()}` : "🏢 All";
      const typeInfo = type ? `🎉 ${type}` : "🎉 Event";
      const dateInfo = date
        ? `📅 ${new Date(date).toLocaleDateString()}`
        : "📅 TBD";
      const statusInfo = status ? `🔵 ${status}` : "🔵 Scheduled";

      return {
        title: `🎪 ${title || "Untitled Event"}`,
        subtitle: `${typeInfo} | ${deptInfo} | ${dateInfo} | ${statusInfo}`,
        media,
      };
    },
  },
});
