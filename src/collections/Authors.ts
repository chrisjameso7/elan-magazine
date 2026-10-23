import { headAdminOnly } from './access';
import type { CollectionConfig } from 'payload';
import { text } from './fields';
export const Authors: CollectionConfig = {
  slug: 'authors', admin: { useAsTitle: 'name' },
  access: { read: () => true, create: headAdminOnly, update: headAdminOnly, delete: headAdminOnly },
  fields: [{ ...text('id', true), defaultValue: () => crypto.randomUUID(), admin: { readOnly: true } }, text('name', true), text('role', true), text('avatar', true), { name: 'bio', type: 'textarea' },
    { name: 'social', type: 'group', fields: [text('instagram'), text('twitter')] }],
};
