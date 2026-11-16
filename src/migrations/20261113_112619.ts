import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lumiere_index"."media" ADD COLUMN "prefix" varchar DEFAULT 'lumiere-index/local';
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "_objectkey" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lumiere_index"."media" DROP COLUMN "prefix";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "_objectkey";`)
}
