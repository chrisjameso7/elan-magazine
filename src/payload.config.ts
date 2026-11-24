import { cmsServerURL } from "./cms/hosting";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { cloudflareImages } from "./cms/cloudflare-images";
import { cloudflarePostgresPool } from "./cms/cloudflare-postgres";
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
  serverURL: cmsServerURL(),
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
  sharp: cloudflareImages,
  db: postgresAdapter({
    schemaName: "lumiere_index",
    pool: cloudflarePostgresPool(env.uri),
    push: false,
    migrationDir: "src/migrations",
  }),
  typescript: { outputFile: "src/cms/payload-types.ts" },
  upload: { limits: { fileSize: 15 * 1024 * 1024 } },
});
