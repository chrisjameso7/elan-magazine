import type { CollectionConfig, Field } from 'payload';
import { isOwner, ownerOnly, readArticles } from '../access';
const privateAccess = {
  read: ownerOnly,
  create: ownerOnly,
  update: ownerOnly,
  delete: ownerOnly,
};
const slug: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  validate: (value: unknown) =>
    (typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
    'Use lowercase words separated by hyphens.',
};
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: { ...privateAccess, admin: ({ req }) => isOwner(req.user) },
  fields: [{ name: 'name', type: 'text', required: true }],
};
export const Contributors: CollectionConfig = {
  slug: 'contributors',
  admin: { useAsTitle: 'name' },
  access: privateAccess,
  fields: [
    { name: 'name', type: 'text', required: true },
    slug,
    { name: 'bio', type: 'textarea' },
  ],
};
export const Sections: CollectionConfig = {
  slug: 'sections',
  admin: { useAsTitle: 'name' },
  access: privateAccess,
  fields: [
    { name: 'name', type: 'text', required: true },
    slug,
    { name: 'description', type: 'textarea' },
  ],
};
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt' },
  access: privateAccess,
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'textarea' },
    { name: 'credit', type: 'text', required: true },
  ],
};
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true, maxPerDoc: 50 },
  access: { ...privateAccess, read: readArticles },
  fields: [
    { name: 'title', type: 'text', required: true },
    slug,
    { name: 'standfirst', type: 'textarea' },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      required: true,
    },
    {
      name: 'contributors',
      type: 'relationship',
      relationTo: 'contributors',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    { name: 'hero', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      validate: (
        value: unknown,
        { siblingData }: { siblingData: { _status?: string } },
      ) =>
        siblingData._status !== 'published' ||
        (typeof value === 'string' && !Number.isNaN(Date.parse(value))) ||
        'Publishing requires a valid publication date.',
    },
    {
      name: 'sources',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: (value: unknown) => {
            try {
              return (
                (typeof value === 'string' &&
                  ['http:', 'https:'].includes(new URL(value).protocol)) ||
                'Use an HTTP(S) source URL.'
              );
            } catch {
              return 'Use a valid source URL.';
            }
          },
        },
      ],
    },
  ],
};
export const newsroomCollections = [
  Users,
  Contributors,
  Sections,
  Media,
  Articles,
];
