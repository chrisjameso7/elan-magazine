import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { newsroomCollections } from './cms/collections';
import { cmsEnvironment } from './cms/environment';
const env = cmsEnvironment();
export default buildConfig({
  secret: env.secret,
  admin: { user: 'users' },
  collections: newsroomCollections,
  editor: lexicalEditor(),
  sharp,
  db: postgresAdapter({
    schemaName: 'lumiere_index',
    pool: { connectionString: env.uri },
    push: false,
    migrationDir: 'src/migrations',
  }),
  typescript: { outputFile: 'src/cms/payload-types.ts' },
  upload: { limits: { fileSize: 15 * 1024 * 1024 } },
});
