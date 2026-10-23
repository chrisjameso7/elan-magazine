import path from 'node:path';
import { APIError, type CollectionConfig } from 'payload';
import { headAdminOnly } from './access';
import { PHOTO_MIME_TYPES, storageConfigured } from '../lib/storage';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt', description: 'Upload JPG, PNG, WebP, AVIF, or GIF photos (up to 20 MB), then select them in a story.' },
  access: { read: () => true, create: headAdminOnly, update: headAdminOnly, delete: headAdminOnly },
  upload: { staticDir: path.resolve(process.cwd(), 'media'), mimeTypes: PHOTO_MIME_TYPES,
    disableLocalStorage: !!process.env.VERCEL },
  hooks: { beforeOperation: [({ operation }) => {
    if (process.env.VERCEL && !storageConfigured() && ['create', 'update'].includes(operation)) {
      throw new APIError('Photo uploads need the S3 storage environment variables. Ask the head admin to configure storage.', 503);
    }
  }] },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Alt text', admin: { description: 'Describe the photo for readers who cannot see it.' } },
    { name: 'caption', type: 'text' }, { name: 'credit', type: 'text' },
  ],
};
