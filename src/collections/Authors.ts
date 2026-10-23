import type { CollectionConfig } from 'payload';
import { text } from './fields';
export const Authors: CollectionConfig = {
  slug: 'authors', admin: { useAsTitle: 'name' },
  access: { read: () => true, create: ({ req }) => !!req.user, update: ({ req }) => !!req.user, delete: ({ req }) => !!req.user },
  fields: [text('id', true), text('name', true), text('role', true), text('avatar', true), { name: 'bio', type: 'textarea' },
    { name: 'social', type: 'group', fields: [text('instagram'), text('twitter')] }],
};
