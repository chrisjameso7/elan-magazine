import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lumiere_index"."articles_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "lumiere_index"."_articles_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "lumiere_index"."articles_rels" ADD CONSTRAINT "articles_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "lumiere_index"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "lumiere_index"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_rels_media_id_idx" ON "lumiere_index"."articles_rels" USING btree ("media_id");
  CREATE INDEX "_articles_v_rels_media_id_idx" ON "lumiere_index"."_articles_v_rels" USING btree ("media_id");
  ALTER TABLE "lumiere_index"."contributors" DROP COLUMN "is_public";
  ALTER TABLE "lumiere_index"."sections" DROP COLUMN "is_public";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "is_public";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lumiere_index"."articles_rels" DROP CONSTRAINT "articles_rels_media_fk";

  ALTER TABLE "lumiere_index"."_articles_v_rels" DROP CONSTRAINT "_articles_v_rels_media_fk";

  DROP INDEX "lumiere_index"."articles_rels_media_id_idx";
  DROP INDEX "lumiere_index"."_articles_v_rels_media_id_idx";
  ALTER TABLE "lumiere_index"."contributors" ADD COLUMN "is_public" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."sections" ADD COLUMN "is_public" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "is_public" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."articles_rels" DROP COLUMN "media_id";
  ALTER TABLE "lumiere_index"."_articles_v_rels" DROP COLUMN "media_id";`)
}
