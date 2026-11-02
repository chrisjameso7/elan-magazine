import { hasMedia } from '../lib/media';
import type { CollectionConfig } from 'payload';
import { text, media, mediaFields } from './fields';
import { headAdminOnly, publicEditorialRead } from './access';
import {
  slugField,
  releaseFields,
  productionField,
  sponsorshipField,
} from './worldFields';

export const Covers: CollectionConfig = {
  slug: 'covers',
  admin: {
    useAsTitle: 'title',
    group: 'ÉLAN World',
    defaultColumns: ['title', 'issueIdentifier', 'publishedAt', '_status'],
  },
  versions: { drafts: true },
  access: {
    read: publicEditorialRead,
    create: headAdminOnly,
    update: headAdminOnly,
    delete: headAdminOnly,
  },
  fields: [
    text('title', true),
    slugField,
    text('issueIdentifier', true),
    { name: 'intro', type: 'textarea', required: true },
    media('artwork', true),
    {
      name: 'personalities',
      type: 'relationship',
      relationTo: 'personalities',
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: 'story',
      type: 'relationship',
      relationTo: 'articles',
      required: true,
      admin: {
        description:
          'The published main profile or interview. Reuse editorial content rather than copying it.',
      },
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Additional cover variations',
      fields: [
        text('label', true),
        media('artwork', true),
        {
          name: 'personalities',
          type: 'relationship',
          relationTo: 'personalities',
          hasMany: true,
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      validate: (value: unknown) =>
        !value ||
        (Array.isArray(value) && value.every(hasMedia)) ||
        'Every gallery photo needs an upload or an image URL and alt text.',
      fields: mediaFields(),
    },
    productionField,
    { name: 'behindTheScenes', type: 'textarea' },
    {
      name: 'relatedStories',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },
    {
      name: 'isHomepage',
      type: 'checkbox',
      label: 'Lead the homepage while published',
      admin: {
        description:
          'If multiple campaigns are selected, the newest release leads.',
      },
    },
    sponsorshipField,
    ...releaseFields,
  ],
};
