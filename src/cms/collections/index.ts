import { recoveryEmail } from "../recovery-email";
import type { CollectionConfig, Field, PayloadRequest } from "payload";
import {
  isAdmin,
  isStaff,
  isOwner,
  adminOnly,
  editorOnly,
  staffOnly,
  readArticles,
  updateArticles,
  publicRecordRead,
} from "../access";
import {
  articleWorkflow,
  userGuard,
  captureDraftIntent,
  accountOperation,
} from "../workflow";
const slug: Field = {
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) =>
        value ||
        String(siblingData.title || siblingData.name || "")
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
    ],
  },
  validate: (value: unknown) =>
    (typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
    "Use lowercase words separated by hyphens.",
};
const staffReadField = {
  read: ({ req }: { req: PayloadRequest }) => isStaff(req.user),
};
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 28800,
    maxLoginAttempts: 5,
    lockTime: 600000,
    forgotPassword: {
      generateEmailSubject: () => "Reset your Lumière Index newsroom password",
      generateEmailHTML: (args) => {
        if (!args?.token) throw new Error("Recovery token is required.");
        return recoveryEmail({ token: args.token, name: args.user?.name });
      },
    },
  },
  admin: {
    useAsTitle: "email",
    group: "Newsroom",
    hidden: ({ user }) => !isAdmin(user),
    defaultColumns: ["name", "email", "role"],
  },
  access: {
    admin: ({ req }) => isStaff(req.user),
    read: ({ req }) =>
      isAdmin(req.user)
        ? true
        : req.user
          ? { id: { equals: req.user.id } }
          : false,
    create: adminOnly,
    update: ({ req }) =>
      isAdmin(req.user)
        ? true
        : req.user
          ? { id: { equals: req.user.id } }
          : false,
    delete: ({ req, id }) =>
      isAdmin(req.user) && String(req.user?.id) !== String(id),
  },
  hooks: {
    beforeOperation: [accountOperation],
    beforeChange: [userGuard],
    beforeDelete: [
      async ({ id, req }) => {
        const target = await req.payload.findByID({
          collection: "users",
          id,
          overrideAccess: true,
          depth: 0,
          req,
        });
        if (isOwner(target))
          throw new Error("The configured owner account cannot be deleted.");
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "writer",
      saveToJWT: true,
      options: [
        { label: "Administrator", value: "administrator" },
        { label: "Editor", value: "editor" },
        { label: "Writer", value: "writer" },
      ],
      access: { create: adminOnly, update: adminOnly },
    },
    {
      name: "contributor",
      type: "relationship",
      relationTo: "contributors",
      access: { create: adminOnly, update: adminOnly },
    },
  ],
};
export const Contributors: CollectionConfig = {
  slug: "contributors",
  admin: {
    useAsTitle: "name",
    group: "Editorial",
    defaultColumns: ["name", "slug", "updatedAt"],
  },
  access: {
    read: publicRecordRead("contributors"),
    create: editorOnly,
    update: editorOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text", required: true },
    slug,
    { name: "bio", type: "textarea" },
    { name: "portrait", type: "upload", relationTo: "media" },
  ],
};
export const Sections: CollectionConfig = {
  slug: "sections",
  admin: { useAsTitle: "name", group: "Editorial" },
  access: {
    read: publicRecordRead("sections"),
    create: editorOnly,
    update: editorOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text", required: true },
    slug,
    { name: "description", type: "textarea" },
    { name: "navOrder", type: "number", defaultValue: 10 },
  ],
};
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    group: "Editorial",
    defaultColumns: [
      "filename",
      "alt",
      "credit",
      "licenseType",
      "rightsConfirmed",
    ],
  },
  access: {
    read: publicRecordRead("media"),
    create: staffOnly,
    update: ({ req }) =>
      isAdmin(req.user) || req.user?.role === "editor"
        ? true
        : isStaff(req.user)
          ? { uploadedBy: { equals: req.user!.id } }
          : false,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === "create") data.uploadedBy = req.user?.id;
        return data;
      },
    ],
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    imageSizes: [
      { name: "thumbnail", width: 480 },
      { name: "story", width: 1280 },
      { name: "hero", width: 1920 },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    { name: "alt", type: "text", required: true },
    { name: "caption", type: "textarea" },
    { name: "credit", type: "text", required: true },
    {
      name: "licenseType",
      type: "select",
      required: true,
      options: [
        "owned",
        "licensed",
        "permission",
        "press",
        "creative-commons",
        "other",
      ],
    },
    {
      name: "licenseReference",
      type: "text",
      access: staffReadField,
      admin: {
        description: "Licence URL, contract reference or source record.",
      },
    },
    { name: "rightsNotes", type: "textarea", access: staffReadField },
    { name: "licenseExpiresAt", type: "date", access: staffReadField },
    {
      name: "rightsConfirmed",
      type: "checkbox",
      defaultValue: false,
      access: { create: editorOnly, update: editorOnly },
      admin: {
        description:
          "An editor confirms that publication rights have been checked.",
      },
    },
    {
      name: "uploadedBy",
      type: "relationship",
      relationTo: "users",
      admin: { readOnly: true },
      access: staffReadField,
    },
  ],
};
export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    group: "Editorial",
    defaultColumns: [
      "title",
      "reviewStatus",
      "_status",
      "assignedTo",
      "publishedAt",
      "updatedAt",
    ],
    listSearchableFields: ["title", "slug", "standfirst"],
    description:
      "Save your draft before using Preview. Approval and publication are separate actions.",
    preview: (doc) => (doc.id ? `/preview/${doc.id}` : null),
    components: {
      edit: {
        PublishButton: "/src/cms/components/PublishControl#PublishControl",
        UnpublishButton: "/src/cms/components/PublishControl#UnpublishControl",
      },
    },
  },
  versions: { drafts: true, maxPerDoc: 50 },
  access: {
    read: readArticles,
    readVersions: editorOnly,
    create: staffOnly,
    update: updateArticles,
    delete: adminOnly,
  },
  hooks: {
    beforeOperation: [captureDraftIntent],
    beforeChange: [articleWorkflow],
  },
  fields: [
    { name: "title", type: "text", required: true },
    slug,
    { name: "standfirst", type: "textarea", required: true },
    { name: "body", type: "richText", required: true },
    { name: "hero", type: "upload", relationTo: "media" },
    {
      name: "section",
      type: "relationship",
      relationTo: "sections",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "contributors",
      type: "relationship",
      relationTo: "contributors",
      hasMany: true,
      required: true,
      minRows: 1,
      admin: { position: "sidebar" },
    },
    {
      name: "format",
      type: "select",
      defaultValue: "news",
      required: true,
      options: ["news", "feature", "interview", "analysis", "review"],
      admin: { position: "sidebar" },
    },
    {
      name: "verdict",
      type: "select",
      options: [
        { label: "Obsessed", value: "obsessed" },
        { label: "On repeat", value: "on-repeat" },
        { label: "It's fine", value: "fine" },
        { label: "Skip", value: "skip" },
      ],
      admin: {
        position: "sidebar",
        condition: (data) => data?.format === "review",
        description: "The Index verdict scale. Shown on reviews only.",
      },
    },
    {
      name: "reviewStatus",
      type: "select",
      defaultValue: "draft",
      required: true,
      index: true,
      options: [
        { label: "Draft", value: "draft" },
        { label: "Pending review", value: "in_review" },
        { label: "Changes requested", value: "changes_requested" },
        { label: "Approved — ready to publish", value: "approved" },
      ],
      admin: {
        position: "sidebar",
        components: { Field: "/src/cms/components/ReviewField#ReviewField" },
        description: "Save approval before publishing.",
      },
    },
    {
      name: "assignedTo",
      type: "relationship",
      relationTo: "users",
      access: {
        read: staffReadField.read,
        create: editorOnly,
        update: editorOnly,
      },
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      type: "date",
      index: true,
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        description:
          "First publication: use a future time to hold an approved published story until release. Keep this date when updating a live story.",
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      access: { create: editorOnly, update: editorOnly },
      admin: { position: "sidebar" },
    },
    {
      name: "editorialNotes",
      type: "textarea",
      access: { ...staffReadField, create: editorOnly, update: editorOnly },
      admin: {
        description:
          "Private editorial feedback. Never included in public responses.",
      },
    },
    {
      name: "sources",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "url",
          type: "text",
          required: true,
          validate: (value: unknown) => {
            try {
              return (
                (typeof value === "string" &&
                  ["http:", "https:"].includes(new URL(value).protocol)) ||
                "Use an HTTP(S) source URL."
              );
            } catch {
              return "Use a valid source URL.";
            }
          },
        },
      ],
    },
    ...["createdBy", "updatedBy", "approvedBy"].map((name) => ({
      name,
      type: "relationship" as const,
      relationTo: "users" as const,
      admin: { readOnly: true, position: "sidebar" as const },
      access: {
        read: staffReadField.read,
        create: () => false,
        update: () => false,
      },
    })),
    ...["submittedAt", "approvedAt", "firstPublishedAt"].map((name) => ({
      name,
      type: "date" as const,
      admin: { readOnly: true, position: "sidebar" as const },
      access: { create: () => false, update: () => false },
    })),
    {
      name: "linkedMedia",
      type: "relationship",
      relationTo: "media",
      hasMany: true,
      admin: { hidden: true },
      access: {
        read: staffReadField.read,
        create: () => false,
        update: () => false,
      },
    },
    {
      name: "isTestData",
      type: "checkbox",
      defaultValue: false,
      admin: { hidden: true },
      access: {
        create: () => false,
        update: () => false,
        read: staffReadField.read,
      },
    },
  ],
};
const publishedOrStaff = ({ req }: { req: PayloadRequest }) =>
  isStaff(req.user) ? true : { isPublished: { equals: true } };
const publishedField: Field = {
  name: "isPublished",
  type: "checkbox",
  defaultValue: false,
  index: true,
  admin: { position: "sidebar", description: "Only published entries appear on the site." },
};
export const IndexEntries: CollectionConfig = {
  slug: "index-entries",
  labels: { singular: "Index entry", plural: "The Index 50" },
  admin: {
    useAsTitle: "name",
    group: "The Index",
    defaultColumns: ["week", "rank", "name", "category", "movement", "isPublished"],
    description:
      "One row per place on the weekly list. Signals build the shortlist; editors may move an entry at most five places.",
  },
  defaultSort: ["-week", "rank"],
  access: {
    read: publishedOrStaff,
    create: editorOnly,
    update: editorOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: "week",
      type: "date",
      required: true,
      index: true,
      admin: { description: "The Thursday this list is published." },
    },
    { name: "rank", type: "number", required: true, min: 1, max: 50 },
    { name: "name", type: "text", required: true, maxLength: 120 },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "music",
      options: [
        { label: "Music", value: "music" },
        { label: "Film & TV", value: "film-tv" },
        { label: "Internet", value: "internet" },
        { label: "Style", value: "style" },
        { label: "Books", value: "books" },
        { label: "Art & design", value: "art" },
        { label: "Sport", value: "sport" },
        { label: "Gaming", value: "gaming" },
        { label: "Culture", value: "culture" },
      ],
    },
    { name: "why", label: "Why this week", type: "text", required: true, maxLength: 160 },
    {
      name: "movement",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New entry", value: "new" },
        { label: "Up", value: "up" },
        { label: "Down", value: "down" },
        { label: "No change", value: "same" },
      ],
    },
    {
      name: "places",
      type: "number",
      min: 0,
      max: 49,
      admin: {
        condition: (data) => data?.movement === "up" || data?.movement === "down",
        description: "How many places it moved since last week.",
      },
    },
    { name: "story", type: "relationship", relationTo: "articles" },
    publishedField,
  ],
};
export const Discoveries: CollectionConfig = {
  slug: "discoveries",
  labels: { singular: "Called It entry", plural: "Called It" },
  admin: {
    useAsTitle: "name",
    group: "The Index",
    defaultColumns: ["name", "firstCoveredAt", "metricThen", "metricNow", "isPublished"],
    description:
      "Our receipts: who we covered before everyone else. Only use figures you can source.",
  },
  defaultSort: "-firstCoveredAt",
  access: {
    read: publishedOrStaff,
    create: editorOnly,
    update: editorOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 120 },
    { name: "story", type: "relationship", relationTo: "articles" },
    { name: "firstCoveredAt", type: "date", required: true },
    {
      name: "metricLabel",
      type: "text",
      maxLength: 40,
      admin: {
        description:
          "What the figure counts, e.g. followers, monthly listeners, subscribers, views. Leave blank to show a milestone instead.",
      },
    },
    { name: "metricThen", label: "Then (figure or milestone)", type: "text", maxLength: 60 },
    { name: "metricNow", label: "Now (figure or milestone)", type: "text", maxLength: 60 },
    publishedField,
  ],
};
export const Tips: CollectionConfig = {
  slug: "tips",
  labels: { singular: "Tip", plural: "Put Us On tips" },
  admin: {
    useAsTitle: "name",
    group: "The Index",
    defaultColumns: ["name", "status", "isSelf", "createdAt"],
    description: "Reader tips from the Put Us On form.",
  },
  defaultSort: "-createdAt",
  access: {
    read: staffOnly,
    create: () => false,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "name", label: "Who", type: "text", required: true, maxLength: 120 },
    { name: "link", type: "text", required: true, maxLength: 500 },
    { name: "why", label: "Why now", type: "text", maxLength: 280 },
    { name: "isSelf", label: "Sent by the person themselves", type: "checkbox", defaultValue: false },
    { name: "email", type: "email" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      required: true,
      options: [
        { label: "New", value: "new" },
        { label: "Listening", value: "listening" },
        { label: "Covered", value: "covered" },
        { label: "Passed", value: "passed" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
export const beatOptions = [
  { label: "Music", value: "music" },
  { label: "Film & TV", value: "film-tv" },
  { label: "Internet", value: "internet" },
  { label: "Style", value: "style" },
  { label: "Books", value: "books" },
  { label: "Art & design", value: "art" },
  { label: "Sport", value: "sport" },
  { label: "Gaming", value: "gaming" },
  { label: "Culture", value: "culture" },
];
export const Applications: CollectionConfig = {
  slug: "applications",
  labels: { singular: "Writer application", plural: "Writer applications" },
  admin: {
    useAsTitle: "name",
    group: "The Index",
    defaultColumns: ["name", "status", "beats", "createdAt"],
    description: "Applications from the Write for us page.",
  },
  defaultSort: "-createdAt",
  access: {
    read: staffOnly,
    create: () => false,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 120 },
    { name: "email", type: "email", required: true },
    { name: "location", type: "text", maxLength: 120 },
    {
      name: "beats",
      label: "What they want to cover",
      type: "select",
      hasMany: true,
      options: beatOptions,
    },
    {
      name: "formats",
      type: "select",
      hasMany: true,
      options: [
        { label: "Discover (first looks)", value: "discover" },
        { label: "Critique (reviews)", value: "critique" },
        { label: "Personal (essays)", value: "personal" },
      ],
    },
    { name: "pitch", label: "First pitch", type: "textarea", required: true, maxLength: 1500 },
    { name: "whyThem", label: "Why them", type: "textarea", maxLength: 800 },
    { name: "samples", label: "Writing samples", type: "textarea", maxLength: 1000 },
    { name: "social", label: "Social handle", type: "text", maxLength: 120 },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Reviewing", value: "reviewing" },
        { label: "Accepted", value: "accepted" },
        { label: "Declined", value: "declined" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "editorNotes",
      type: "textarea",
      admin: { position: "sidebar", description: "Private to staff." },
    },
  ],
};
export const newsroomCollections = [
  Users,
  Contributors,
  Sections,
  Media,
  Articles,
  IndexEntries,
  Discoveries,
  Tips,
  Applications,
];
