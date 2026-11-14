import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { postgresPool } from "./lib/postgres-pool";
import { newsroomIntegrations } from "./cms/integrations";
import { newsroomCollections } from "./cms/collections";
import { cmsEnvironment } from "./cms/environment";
const env = cmsEnvironment();
const integrations = newsroomIntegrations();
export default buildConfig({
  secret: env.secret,
  email: integrations.email,
  plugins: [integrations.storage],
  cookiePrefix: "lumiere",
  serverURL:
    process.env.CMS_SERVER_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3200"),
  admin: {
    user: "users",
    importMap: {
      baseDir: process.cwd(),
      importMapFile: "src/app/(cms)/admin/importMap.js",
    },
    meta: { titleSuffix: " | Lumière Newsroom" },
    components: {
      graphics: {
        Logo: "/src/cms/components/Brand#Logo",
        Icon: "/src/cms/components/Brand#Icon",
      },
      beforeLogin: ["/src/cms/components/Brand#LoginInfo"],
      beforeDashboard: ["/src/cms/components/Dashboard#Dashboard"],
    },
  },
  collections: newsroomCollections,
  editor: lexicalEditor(),
  sharp,
  db: postgresAdapter({
    schemaName: "lumiere_index",
    pool: postgresPool(env.uri),
    push: false,
    migrationDir: "src/migrations",
  }),
  typescript: { outputFile: "src/cms/payload-types.ts" },
  upload: { limits: { fileSize: 15 * 1024 * 1024 } },
});
