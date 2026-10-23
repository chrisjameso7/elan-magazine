import type { CollectionConfig } from 'payload';
export const Users: CollectionConfig = {
  slug: 'users', auth: true,
  access: { read: ({ req }) => !!req.user, create: ({ req }) => !!req.user, update: ({ req }) => !!req.user, delete: ({ req }) => !!req.user },
  fields: [],
};
