import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { Articles } from './collections/Articles';
import { Authors } from './collections/Authors';
import { Users } from './collections/Users';

// Prepared for the later route/data migration. The public site still uses mock data.
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, push: false }),
  editor: lexicalEditor(), sharp,
  collections: [Users, Authors, Articles],
});
