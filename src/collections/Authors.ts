import { headAdminOnly } from './access';
import { ValidationError, type CollectionConfig } from 'payload';
import { text } from './fields';
export const Authors: CollectionConfig = {
  slug: 'authors', admin: { useAsTitle: 'name' },
  access: { read: () => true, create: headAdminOnly, update: headAdminOnly, delete: headAdminOnly },
  hooks: { beforeValidate: [({ data, originalDoc }) => {
    const author = { ...originalDoc, ...data };
    if (!author.avatarUpload && !author.avatar?.trim()) {
      throw new ValidationError({ errors: [{ path: 'avatarUpload', message: 'Upload a contributor photo or provide an avatar URL.' }] });
    }
    return data;
  }] },
  fields: [{ ...text('id', true), defaultValue: () => crypto.randomUUID(), admin: { readOnly: true } }, text('name', true), text('role', true), { name: 'avatarUpload', type: 'upload', relationTo: 'media', label: 'Contributor photo' }, text('avatar'), { name: 'bio', type: 'textarea' },
    { name: 'social', type: 'group', fields: [text('instagram'), text('twitter')] }],
};
