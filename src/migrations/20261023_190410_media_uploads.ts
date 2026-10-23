import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "elan"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"prefix" varchar DEFAULT 'elan',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );

  ALTER TABLE "elan"."authors" ALTER COLUMN "avatar" DROP NOT NULL;
  ALTER TABLE "elan"."authors" ADD COLUMN "avatar_upload_id" integer;
  ALTER TABLE "elan"."articles_blocks_image" ADD COLUMN "image_asset_id" integer;
  ALTER TABLE "elan"."articles_blocks_image_duo_images" ADD COLUMN "asset_id" integer;
  ALTER TABLE "elan"."articles" ADD COLUMN "cover_image_asset_id" integer;
  ALTER TABLE "elan"."articles" ADD COLUMN "interview_portrait_asset_id" integer;
  ALTER TABLE "elan"."articles" ADD COLUMN "interview_secondary_portrait_asset_id" integer;
  ALTER TABLE "elan"."_articles_v_blocks_image" ADD COLUMN "image_asset_id" integer;
  ALTER TABLE "elan"."_articles_v_blocks_image_duo_images" ADD COLUMN "asset_id" integer;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_cover_image_asset_id" integer;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_interview_portrait_asset_id" integer;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_interview_secondary_portrait_asset_id" integer;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD COLUMN "media_id" integer;
  CREATE INDEX "media_updated_at_idx" ON "elan"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "elan"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "elan"."media" USING btree ("filename");
  ALTER TABLE "elan"."authors" ADD CONSTRAINT "authors_avatar_upload_id_media_id_fk" FOREIGN KEY ("avatar_upload_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_image" ADD CONSTRAINT "articles_blocks_image_image_asset_id_media_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_image_duo_images" ADD CONSTRAINT "articles_blocks_image_duo_images_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."articles" ADD CONSTRAINT "articles_cover_image_asset_id_media_id_fk" FOREIGN KEY ("cover_image_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."articles" ADD CONSTRAINT "articles_interview_portrait_asset_id_media_id_fk" FOREIGN KEY ("interview_portrait_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."articles" ADD CONSTRAINT "articles_interview_secondary_portrait_asset_id_media_id_fk" FOREIGN KEY ("interview_secondary_portrait_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_image" ADD CONSTRAINT "_articles_v_blocks_image_image_asset_id_media_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_image_duo_images" ADD CONSTRAINT "_articles_v_blocks_image_duo_images_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v" ADD CONSTRAINT "_articles_v_version_cover_image_asset_id_media_id_fk" FOREIGN KEY ("version_cover_image_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v" ADD CONSTRAINT "_articles_v_version_interview_portrait_asset_id_media_id_fk" FOREIGN KEY ("version_interview_portrait_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v" ADD CONSTRAINT "_articles_v_version_interview_secondary_portrait_asset_id_media_id_fk" FOREIGN KEY ("version_interview_secondary_portrait_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "elan"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "authors_avatar_upload_idx" ON "elan"."authors" USING btree ("avatar_upload_id");
  CREATE INDEX "articles_blocks_image_image_image_asset_idx" ON "elan"."articles_blocks_image" USING btree ("image_asset_id");
  CREATE INDEX "articles_blocks_image_duo_images_asset_idx" ON "elan"."articles_blocks_image_duo_images" USING btree ("asset_id");
  CREATE INDEX "articles_cover_image_cover_image_asset_idx" ON "elan"."articles" USING btree ("cover_image_asset_id");
  CREATE INDEX "articles_interview_portrait_interview_portrait_asset_idx" ON "elan"."articles" USING btree ("interview_portrait_asset_id");
  CREATE INDEX "articles_interview_secondary_portrait_interview_secondar_idx" ON "elan"."articles" USING btree ("interview_secondary_portrait_asset_id");
  CREATE INDEX "_articles_v_blocks_image_image_image_asset_idx" ON "elan"."_articles_v_blocks_image" USING btree ("image_asset_id");
  CREATE INDEX "_articles_v_blocks_image_duo_images_asset_idx" ON "elan"."_articles_v_blocks_image_duo_images" USING btree ("asset_id");
  CREATE INDEX "_articles_v_version_cover_image_version_cover_image_asse_idx" ON "elan"."_articles_v" USING btree ("version_cover_image_asset_id");
  CREATE INDEX "_articles_v_version_interview_portrait_version_interview_idx" ON "elan"."_articles_v" USING btree ("version_interview_portrait_asset_id");
  CREATE INDEX "_articles_v_version_interview_secondary_portrait_version_idx" ON "elan"."_articles_v" USING btree ("version_interview_secondary_portrait_asset_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "elan"."payload_locked_documents_rels" USING btree ("media_id");
  REVOKE ALL ON TABLE "elan"."media" FROM PUBLIC;
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON TABLE "elan"."media" FROM anon; END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON TABLE "elan"."media" FROM authenticated; END IF;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM "elan"."media") THEN
      RAISE EXCEPTION 'Migrate or remove uploaded media before rolling back this schema.';
    END IF;
  END $$;
  ALTER TABLE "elan"."authors" DROP CONSTRAINT "authors_avatar_upload_id_media_id_fk";

  ALTER TABLE "elan"."articles_blocks_image" DROP CONSTRAINT "articles_blocks_image_image_asset_id_media_id_fk";

  ALTER TABLE "elan"."articles_blocks_image_duo_images" DROP CONSTRAINT "articles_blocks_image_duo_images_asset_id_media_id_fk";

  ALTER TABLE "elan"."articles" DROP CONSTRAINT "articles_cover_image_asset_id_media_id_fk";

  ALTER TABLE "elan"."articles" DROP CONSTRAINT "articles_interview_portrait_asset_id_media_id_fk";

  ALTER TABLE "elan"."articles" DROP CONSTRAINT "articles_interview_secondary_portrait_asset_id_media_id_fk";

  ALTER TABLE "elan"."_articles_v_blocks_image" DROP CONSTRAINT "_articles_v_blocks_image_image_asset_id_media_id_fk";

  ALTER TABLE "elan"."_articles_v_blocks_image_duo_images" DROP CONSTRAINT "_articles_v_blocks_image_duo_images_asset_id_media_id_fk";

  ALTER TABLE "elan"."_articles_v" DROP CONSTRAINT "_articles_v_version_cover_image_asset_id_media_id_fk";

  ALTER TABLE "elan"."_articles_v" DROP CONSTRAINT "_articles_v_version_interview_portrait_asset_id_media_id_fk";

  ALTER TABLE "elan"."_articles_v" DROP CONSTRAINT "_articles_v_version_interview_secondary_portrait_asset_id_media_id_fk";

  ALTER TABLE "elan"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_fk";

  DROP INDEX "elan"."authors_avatar_upload_idx";
  DROP INDEX "elan"."articles_blocks_image_image_image_asset_idx";
  DROP INDEX "elan"."articles_blocks_image_duo_images_asset_idx";
  DROP INDEX "elan"."articles_cover_image_cover_image_asset_idx";
  DROP INDEX "elan"."articles_interview_portrait_interview_portrait_asset_idx";
  DROP INDEX "elan"."articles_interview_secondary_portrait_interview_secondar_idx";
  DROP INDEX "elan"."_articles_v_blocks_image_image_image_asset_idx";
  DROP INDEX "elan"."_articles_v_blocks_image_duo_images_asset_idx";
  DROP INDEX "elan"."_articles_v_version_cover_image_version_cover_image_asse_idx";
  DROP INDEX "elan"."_articles_v_version_interview_portrait_version_interview_idx";
  DROP INDEX "elan"."_articles_v_version_interview_secondary_portrait_version_idx";
  DROP INDEX "elan"."payload_locked_documents_rels_media_id_idx";
  ALTER TABLE "elan"."authors" ALTER COLUMN "avatar" SET NOT NULL;
  ALTER TABLE "elan"."authors" DROP COLUMN "avatar_upload_id";
  ALTER TABLE "elan"."articles_blocks_image" DROP COLUMN "image_asset_id";
  ALTER TABLE "elan"."articles_blocks_image_duo_images" DROP COLUMN "asset_id";
  ALTER TABLE "elan"."articles" DROP COLUMN "cover_image_asset_id";
  ALTER TABLE "elan"."articles" DROP COLUMN "interview_portrait_asset_id";
  ALTER TABLE "elan"."articles" DROP COLUMN "interview_secondary_portrait_asset_id";
  ALTER TABLE "elan"."_articles_v_blocks_image" DROP COLUMN "image_asset_id";
  ALTER TABLE "elan"."_articles_v_blocks_image_duo_images" DROP COLUMN "asset_id";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_cover_image_asset_id";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_interview_portrait_asset_id";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_interview_secondary_portrait_asset_id";
  ALTER TABLE "elan"."payload_locked_documents_rels" DROP COLUMN "media_id";
  DROP TABLE "elan"."media";`)
}
