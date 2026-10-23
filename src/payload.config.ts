import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { s3Storage } from '@payloadcms/storage-s3';
import { Media } from './collections/Media';
import { isHeadAdmin } from './collections/access';
import { MAX_PHOTO_BYTES, storageConfigured } from './lib/storage';
import { postgresPool } from './lib/postgresPool';
import { Articles } from './collections/Articles';
import { Authors } from './collections/Authors';
import { Users } from './collections/Users';

// DATABASE_URI enables live publishing; leave it unset for the mock preview.
export default buildConfig({
  serverURL: process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: { user: 'users', importMap: { baseDir: process.cwd() } },
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({ schemaName: 'elan', pool: postgresPool(process.env.DATABASE_URI), push: process.env.PAYLOAD_DB_PUSH === 'true' && process.env.NODE_ENV !== 'production' }),
  editor: lexicalEditor(), sharp,
  collections: [Users, Authors, Articles, Media],
  upload: { limits: { fileSize: MAX_PHOTO_BYTES } },
  plugins: [s3Storage({
    enabled: storageConfigured(), alwaysInsertFields: true,
    collections: { media: { prefix: 'elan' } },
    bucket: process.env.S3_BUCKET || 'elan-media',
    clientUploads: { access: ({ req }) => isHeadAdmin(req.user) },
    config: {
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'eu-west-1', forcePathStyle: true,
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || '', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '' },
      requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
    },
  })],
});
