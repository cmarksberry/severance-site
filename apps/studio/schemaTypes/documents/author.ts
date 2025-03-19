import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Lumon Employee",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      description: "The full name of the Lumon employee",
      validation: (Rule) => Rule.required().error("Employee name is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description: "URL-friendly version of the employee's name",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),
    defineField({
      name: "isSevered",
      type: "boolean",
      title: "Severed Employee",
      description: "Whether this employee has undergone the Severance procedure",
      initialValue: false,
    }),
    defineField({
      name: "innieName",
      type: "string",
      title: "Innie Name",
      description: "The name used by the employee's innie (if different from their outie name)",
      hidden: ({ parent }) => !parent?.isSevered,
    }),
    defineField({
      name: "severanceDate",
      type: "date",
      title: "Severance Date",
      description: "The date when the employee underwent the Severance procedure",
      hidden: ({ parent }) => !parent?.isSevered,
    }),
    defineField({
      name: "department",
      type: "string",
      title: "Department",
      description: "The Lumon department this employee belongs to",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "employeeId",
      type: "string",
      title: "Employee ID",
      description: "The employee's Lumon ID number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Photo",
      description: "A photo of the employee for their profile",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      type: "text",
      title: "Bio",
      description: "A brief description of the employee's role and responsibilities",
      rows: 3,
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      description: "The current status of the employee",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "On Leave", value: "on-leave" },
          { title: "Terminated", value: "terminated" },
          { title: "In Wellness", value: "wellness" },
        ],
      },
      initialValue: "active",
    }),
    defineField({
      name: "notableAchievements",
      type: "array",
      title: "Notable Achievements",
      description: "Key accomplishments or milestones in their Lumon career",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "wellnessVisits",
      type: "array",
      title: "Wellness Visits",
      description: "Record of wellness sessions and their outcomes",
      hidden: ({ parent }) => !parent?.isSevered,
      of: [
        {
          type: "object",
          fields: [
            {
              name: "date",
              type: "date",
              title: "Visit Date",
            },
            {
              name: "reason",
              type: "string",
              title: "Reason",
              options: {
                list: [
                  { title: "Standard Check-up", value: "standard" },
                  { title: "Behavioral Issue", value: "behavioral" },
                  { title: "Protocol Violation", value: "protocol" },
                  { title: "Requested Visit", value: "requested" },
                ],
              },
            },
            {
              name: "notes",
              type: "text",
              title: "Notes",
              rows: 2,
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      innieName: "innieName",
      department: "department",
      media: "image",
      status: "status",
      employeeId: "employeeId",
      isSevered: "isSevered",
    },
    prepare: ({
      title,
      innieName,
      department,
      media,
      status,
      employeeId,
      isSevered,
    }) => {
      // Create a Severance-themed subtitle
      const deptInfo = department ? `🏢 ${department.toUpperCase()}` : "🏢 Unassigned";
      const statusInfo = status ? `🔵 ${status}` : "🔵 Active";
      const innieInfo = innieName ? `👤 Innie: ${innieName}` : "";
      const idInfo = employeeId ? `🆔 ${employeeId}` : "";
      const severedInfo = isSevered ? "🧠 Severed" : "🧠 Unsevered";

      return {
        title: `👤 ${title || "Unnamed Employee"}`,
        subtitle: `${severedInfo} | ${deptInfo} | ${statusInfo} ${innieInfo ? `| ${innieInfo}` : ""} ${idInfo ? `| ${idInfo}` : ""}`,
        media,
      };
    },
  },
});
