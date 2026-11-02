import type { CollectionConfig } from 'payload';
import { text, media } from './fields';
import { headAdminOnly, publicEditorialRead } from './access';
import { slugField, releaseFields } from './worldFields';

export const Personalities: CollectionConfig = {
  slug: 'personalities',
  admin: { useAsTitle: 'name', group: 'ÉLAN World' },
  versions: { drafts: true },
  access: {
    read: publicEditorialRead,
    create: headAdminOnly,
    update: headAdminOnly,
    delete: headAdminOnly,
  },
  fields: [
    text('name', true),
    slugField,
    text('profession', true),
    { name: 'bio', type: 'textarea', required: true },
    media('portrait', true),
    {
      name: 'social',
      type: 'group',
      fields: [text('instagram'), text('website')],
    },
    ...releaseFields,
  ],
};
