import { headAdminOnly, isHeadAdmin } from './access';
import type { CollectionConfig } from 'payload';
export const Users: CollectionConfig = {
  slug: 'users', auth: true,
  access: { admin: ({ req }) => isHeadAdmin(req.user), read: headAdminOnly, create: headAdminOnly, update: headAdminOnly, delete: headAdminOnly },
  fields: [],
};
