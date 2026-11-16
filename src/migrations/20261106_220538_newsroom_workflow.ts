import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "lumiere_index"."enum_users_role" AS ENUM('administrator', 'editor', 'writer');
  CREATE TYPE "lumiere_index"."enum_media_license_type" AS ENUM('owned', 'licensed', 'permission', 'press', 'creative-commons', 'other');
  CREATE TYPE "lumiere_index"."enum_articles_format" AS ENUM('news', 'feature', 'interview', 'analysis', 'review');
  CREATE TYPE "lumiere_index"."enum_articles_review_status" AS ENUM('draft', 'in_review', 'changes_requested', 'approved');
  CREATE TYPE "lumiere_index"."enum__articles_v_version_format" AS ENUM('news', 'feature', 'interview', 'analysis', 'review');
  CREATE TYPE "lumiere_index"."enum__articles_v_version_review_status" AS ENUM('draft', 'in_review', 'changes_requested', 'approved');
  ALTER TABLE "lumiere_index"."users" ADD COLUMN "role" "lumiere_index"."enum_users_role" DEFAULT 'writer' NOT NULL;
  ALTER TABLE "lumiere_index"."users" ADD COLUMN "contributor_id" integer;
  ALTER TABLE "lumiere_index"."contributors" ADD COLUMN "portrait_id" integer;
  ALTER TABLE "lumiere_index"."contributors" ADD COLUMN "is_public" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."sections" ADD COLUMN "nav_order" numeric DEFAULT 10;
  ALTER TABLE "lumiere_index"."sections" ADD COLUMN "is_public" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "license_type" "lumiere_index"."enum_media_license_type";
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "license_reference" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "rights_notes" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "license_expires_at" timestamp(3) with time zone;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "rights_confirmed" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "uploaded_by_id" integer;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "is_public" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_story_url" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_story_width" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_story_height" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_story_mime_type" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_story_filesize" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_story_filename" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_hero_url" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_hero_width" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_hero_height" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_hero_mime_type" varchar;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_hero_filesize" numeric;
  ALTER TABLE "lumiere_index"."media" ADD COLUMN "sizes_hero_filename" varchar;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "format" "lumiere_index"."enum_articles_format" DEFAULT 'news';
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "review_status" "lumiere_index"."enum_articles_review_status" DEFAULT 'draft';
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "assigned_to_id" integer;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "is_featured" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "editorial_notes" varchar;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "submitted_at" timestamp(3) with time zone;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "approved_at" timestamp(3) with time zone;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "first_published_at" timestamp(3) with time zone;
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "is_test_data" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_format" "lumiere_index"."enum__articles_v_version_format" DEFAULT 'news';
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_review_status" "lumiere_index"."enum__articles_v_version_review_status" DEFAULT 'draft';
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_assigned_to_id" integer;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_is_featured" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_editorial_notes" varchar;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_approved_by_id" integer;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_submitted_at" timestamp(3) with time zone;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_approved_at" timestamp(3) with time zone;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_first_published_at" timestamp(3) with time zone;
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_is_test_data" boolean DEFAULT false;
  ALTER TABLE "lumiere_index"."users" ADD CONSTRAINT "users_contributor_id_contributors_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "lumiere_index"."contributors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."contributors" ADD CONSTRAINT "contributors_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "lumiere_index"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles" ADD CONSTRAINT "articles_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles" ADD CONSTRAINT "articles_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles" ADD CONSTRAINT "articles_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles" ADD CONSTRAINT "articles_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v" ADD CONSTRAINT "_articles_v_version_assigned_to_id_users_id_fk" FOREIGN KEY ("version_assigned_to_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v" ADD CONSTRAINT "_articles_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v" ADD CONSTRAINT "_articles_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v" ADD CONSTRAINT "_articles_v_version_approved_by_id_users_id_fk" FOREIGN KEY ("version_approved_by_id") REFERENCES "lumiere_index"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_contributor_idx" ON "lumiere_index"."users" USING btree ("contributor_id");
  CREATE INDEX "contributors_portrait_idx" ON "lumiere_index"."contributors" USING btree ("portrait_id");
  CREATE INDEX "media_uploaded_by_idx" ON "lumiere_index"."media" USING btree ("uploaded_by_id");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "lumiere_index"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_story_sizes_story_filename_idx" ON "lumiere_index"."media" USING btree ("sizes_story_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "lumiere_index"."media" USING btree ("sizes_hero_filename");
  CREATE INDEX "articles_review_status_idx" ON "lumiere_index"."articles" USING btree ("review_status");
  CREATE INDEX "articles_assigned_to_idx" ON "lumiere_index"."articles" USING btree ("assigned_to_id");
  CREATE INDEX "articles_created_by_idx" ON "lumiere_index"."articles" USING btree ("created_by_id");
  CREATE INDEX "articles_updated_by_idx" ON "lumiere_index"."articles" USING btree ("updated_by_id");
  CREATE INDEX "articles_approved_by_idx" ON "lumiere_index"."articles" USING btree ("approved_by_id");
  CREATE INDEX "_articles_v_version_version_review_status_idx" ON "lumiere_index"."_articles_v" USING btree ("version_review_status");
  CREATE INDEX "_articles_v_version_version_assigned_to_idx" ON "lumiere_index"."_articles_v" USING btree ("version_assigned_to_id");
  CREATE INDEX "_articles_v_version_version_created_by_idx" ON "lumiere_index"."_articles_v" USING btree ("version_created_by_id");
  CREATE INDEX "_articles_v_version_version_updated_by_idx" ON "lumiere_index"."_articles_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_articles_v_version_version_approved_by_idx" ON "lumiere_index"."_articles_v" USING btree ("version_approved_by_id");
  REVOKE ALL ON SCHEMA lumiere_index FROM PUBLIC;
  REVOKE ALL ON ALL TABLES IN SCHEMA lumiere_index FROM PUBLIC;
  REVOKE ALL ON ALL SEQUENCES IN SCHEMA lumiere_index FROM PUBLIC;
  DO $$ DECLARE target record; BEGIN
    FOR target IN SELECT tablename FROM pg_tables WHERE schemaname = 'lumiere_index' LOOP
      EXECUTE format('ALTER TABLE lumiere_index.%I ENABLE ROW LEVEL SECURITY',target.tablename);
    END LOOP;
  END $$;
`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lumiere_index"."users" DROP CONSTRAINT "users_contributor_id_contributors_id_fk";

  ALTER TABLE "lumiere_index"."contributors" DROP CONSTRAINT "contributors_portrait_id_media_id_fk";

  ALTER TABLE "lumiere_index"."media" DROP CONSTRAINT "media_uploaded_by_id_users_id_fk";

  ALTER TABLE "lumiere_index"."articles" DROP CONSTRAINT "articles_assigned_to_id_users_id_fk";

  ALTER TABLE "lumiere_index"."articles" DROP CONSTRAINT "articles_created_by_id_users_id_fk";

  ALTER TABLE "lumiere_index"."articles" DROP CONSTRAINT "articles_updated_by_id_users_id_fk";

  ALTER TABLE "lumiere_index"."articles" DROP CONSTRAINT "articles_approved_by_id_users_id_fk";

  ALTER TABLE "lumiere_index"."_articles_v" DROP CONSTRAINT "_articles_v_version_assigned_to_id_users_id_fk";

  ALTER TABLE "lumiere_index"."_articles_v" DROP CONSTRAINT "_articles_v_version_created_by_id_users_id_fk";

  ALTER TABLE "lumiere_index"."_articles_v" DROP CONSTRAINT "_articles_v_version_updated_by_id_users_id_fk";

  ALTER TABLE "lumiere_index"."_articles_v" DROP CONSTRAINT "_articles_v_version_approved_by_id_users_id_fk";

  DROP INDEX "lumiere_index"."users_contributor_idx";
  DROP INDEX "lumiere_index"."contributors_portrait_idx";
  DROP INDEX "lumiere_index"."media_uploaded_by_idx";
  DROP INDEX "lumiere_index"."media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "lumiere_index"."media_sizes_story_sizes_story_filename_idx";
  DROP INDEX "lumiere_index"."media_sizes_hero_sizes_hero_filename_idx";
  DROP INDEX "lumiere_index"."articles_review_status_idx";
  DROP INDEX "lumiere_index"."articles_assigned_to_idx";
  DROP INDEX "lumiere_index"."articles_created_by_idx";
  DROP INDEX "lumiere_index"."articles_updated_by_idx";
  DROP INDEX "lumiere_index"."articles_approved_by_idx";
  DROP INDEX "lumiere_index"."_articles_v_version_version_review_status_idx";
  DROP INDEX "lumiere_index"."_articles_v_version_version_assigned_to_idx";
  DROP INDEX "lumiere_index"."_articles_v_version_version_created_by_idx";
  DROP INDEX "lumiere_index"."_articles_v_version_version_updated_by_idx";
  DROP INDEX "lumiere_index"."_articles_v_version_version_approved_by_idx";
  ALTER TABLE "lumiere_index"."users" DROP COLUMN "role";
  ALTER TABLE "lumiere_index"."users" DROP COLUMN "contributor_id";
  ALTER TABLE "lumiere_index"."contributors" DROP COLUMN "portrait_id";
  ALTER TABLE "lumiere_index"."contributors" DROP COLUMN "is_public";
  ALTER TABLE "lumiere_index"."sections" DROP COLUMN "nav_order";
  ALTER TABLE "lumiere_index"."sections" DROP COLUMN "is_public";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "license_type";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "license_reference";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "rights_notes";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "license_expires_at";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "rights_confirmed";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "uploaded_by_id";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "is_public";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_story_url";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_story_width";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_story_height";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_story_mime_type";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_story_filesize";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_story_filename";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_hero_url";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_hero_width";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_hero_height";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_hero_mime_type";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_hero_filesize";
  ALTER TABLE "lumiere_index"."media" DROP COLUMN "sizes_hero_filename";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "format";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "review_status";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "assigned_to_id";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "is_featured";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "editorial_notes";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "created_by_id";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "updated_by_id";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "approved_by_id";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "submitted_at";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "approved_at";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "first_published_at";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "is_test_data";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_format";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_review_status";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_assigned_to_id";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_is_featured";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_editorial_notes";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_approved_by_id";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_submitted_at";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_approved_at";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_first_published_at";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_is_test_data";
  DROP TYPE "lumiere_index"."enum_users_role";
  DROP TYPE "lumiere_index"."enum_media_license_type";
  DROP TYPE "lumiere_index"."enum_articles_format";
  DROP TYPE "lumiere_index"."enum_articles_review_status";
  DROP TYPE "lumiere_index"."enum__articles_v_version_format";
  DROP TYPE "lumiere_index"."enum__articles_v_version_review_status";`)
}
