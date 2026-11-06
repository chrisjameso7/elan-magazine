import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA IF NOT EXISTS "lumiere_index";
   CREATE TYPE "lumiere_index"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "lumiere_index"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "lumiere_index"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "lumiere_index"."contributors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar NOT NULL,
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
  
  CREATE TABLE "lumiere_index"."articles_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "lumiere_index"."articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"standfirst" varchar,
  	"section_id" integer,
  	"hero_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "lumiere_index"."enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "lumiere_index"."articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"contributors_id" integer
  );
  
  CREATE TABLE "lumiere_index"."_articles_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "lumiere_index"."_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_standfirst" varchar,
  	"version_section_id" integer,
  	"version_hero_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "lumiere_index"."enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "lumiere_index"."_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"contributors_id" integer
  );
  
  CREATE TABLE "lumiere_index"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"contributors_id" integer,
  	"sections_id" integer,
  	"media_id" integer,
  	"articles_id" integer
  );
  
  CREATE TABLE "lumiere_index"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "lumiere_index"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "lumiere_index"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "lumiere_index"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles_sources" ADD CONSTRAINT "articles_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "lumiere_index"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles" ADD CONSTRAINT "articles_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "lumiere_index"."sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles" ADD CONSTRAINT "articles_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "lumiere_index"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "lumiere_index"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."articles_rels" ADD CONSTRAINT "articles_rels_contributors_fk" FOREIGN KEY ("contributors_id") REFERENCES "lumiere_index"."contributors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v_version_sources" ADD CONSTRAINT "_articles_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "lumiere_index"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "lumiere_index"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v" ADD CONSTRAINT "_articles_v_version_section_id_sections_id_fk" FOREIGN KEY ("version_section_id") REFERENCES "lumiere_index"."sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v" ADD CONSTRAINT "_articles_v_version_hero_id_media_id_fk" FOREIGN KEY ("version_hero_id") REFERENCES "lumiere_index"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "lumiere_index"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_contributors_fk" FOREIGN KEY ("contributors_id") REFERENCES "lumiere_index"."contributors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "lumiere_index"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "lumiere_index"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contributors_fk" FOREIGN KEY ("contributors_id") REFERENCES "lumiere_index"."contributors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sections_fk" FOREIGN KEY ("sections_id") REFERENCES "lumiere_index"."sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "lumiere_index"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "lumiere_index"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "lumiere_index"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "lumiere_index"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "lumiere_index"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "lumiere_index"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "lumiere_index"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "lumiere_index"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "lumiere_index"."users" USING btree ("email");
  CREATE UNIQUE INDEX "contributors_slug_idx" ON "lumiere_index"."contributors" USING btree ("slug");
  CREATE INDEX "contributors_updated_at_idx" ON "lumiere_index"."contributors" USING btree ("updated_at");
  CREATE INDEX "contributors_created_at_idx" ON "lumiere_index"."contributors" USING btree ("created_at");
  CREATE UNIQUE INDEX "sections_slug_idx" ON "lumiere_index"."sections" USING btree ("slug");
  CREATE INDEX "sections_updated_at_idx" ON "lumiere_index"."sections" USING btree ("updated_at");
  CREATE INDEX "sections_created_at_idx" ON "lumiere_index"."sections" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "lumiere_index"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "lumiere_index"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "lumiere_index"."media" USING btree ("filename");
  CREATE INDEX "articles_sources_order_idx" ON "lumiere_index"."articles_sources" USING btree ("_order");
  CREATE INDEX "articles_sources_parent_id_idx" ON "lumiere_index"."articles_sources" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "lumiere_index"."articles" USING btree ("slug");
  CREATE INDEX "articles_section_idx" ON "lumiere_index"."articles" USING btree ("section_id");
  CREATE INDEX "articles_hero_idx" ON "lumiere_index"."articles" USING btree ("hero_id");
  CREATE INDEX "articles_published_at_idx" ON "lumiere_index"."articles" USING btree ("published_at");
  CREATE INDEX "articles_updated_at_idx" ON "lumiere_index"."articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "lumiere_index"."articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "lumiere_index"."articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "lumiere_index"."articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "lumiere_index"."articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "lumiere_index"."articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_contributors_id_idx" ON "lumiere_index"."articles_rels" USING btree ("contributors_id");
  CREATE INDEX "_articles_v_version_sources_order_idx" ON "lumiere_index"."_articles_v_version_sources" USING btree ("_order");
  CREATE INDEX "_articles_v_version_sources_parent_id_idx" ON "lumiere_index"."_articles_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "lumiere_index"."_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "lumiere_index"."_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_section_idx" ON "lumiere_index"."_articles_v" USING btree ("version_section_id");
  CREATE INDEX "_articles_v_version_version_hero_idx" ON "lumiere_index"."_articles_v" USING btree ("version_hero_id");
  CREATE INDEX "_articles_v_version_version_published_at_idx" ON "lumiere_index"."_articles_v" USING btree ("version_published_at");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "lumiere_index"."_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "lumiere_index"."_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "lumiere_index"."_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "lumiere_index"."_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "lumiere_index"."_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "lumiere_index"."_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_rels_order_idx" ON "lumiere_index"."_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "lumiere_index"."_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "lumiere_index"."_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_contributors_id_idx" ON "lumiere_index"."_articles_v_rels" USING btree ("contributors_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "lumiere_index"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "lumiere_index"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "lumiere_index"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "lumiere_index"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_contributors_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("contributors_id");
  CREATE INDEX "payload_locked_documents_rels_sections_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("sections_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_preferences_key_idx" ON "lumiere_index"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "lumiere_index"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "lumiere_index"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "lumiere_index"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "lumiere_index"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "lumiere_index"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "lumiere_index"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "lumiere_index"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "lumiere_index"."payload_migrations" USING btree ("created_at");
  REVOKE ALL ON SCHEMA lumiere_index FROM PUBLIC;
  REVOKE ALL ON ALL TABLES IN SCHEMA lumiere_index FROM PUBLIC;
  REVOKE ALL ON ALL SEQUENCES IN SCHEMA lumiere_index FROM PUBLIC;
  DO $$ DECLARE target record; BEGIN
    FOR target IN SELECT tablename FROM pg_tables WHERE schemaname = 'lumiere_index' LOOP
      EXECUTE format('ALTER TABLE lumiere_index.%I ENABLE ROW LEVEL SECURITY', target.tablename);
    END LOOP;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE 'REVOKE ALL ON SCHEMA lumiere_index FROM anon';
      EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA lumiere_index FROM anon';
      EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA lumiere_index FROM anon';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      EXECUTE 'REVOKE ALL ON SCHEMA lumiere_index FROM authenticated';
      EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA lumiere_index FROM authenticated';
      EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA lumiere_index FROM authenticated';
    END IF;
  END $$;
`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "lumiere_index"."users_sessions" CASCADE;
  DROP TABLE "lumiere_index"."users" CASCADE;
  DROP TABLE "lumiere_index"."contributors" CASCADE;
  DROP TABLE "lumiere_index"."sections" CASCADE;
  DROP TABLE "lumiere_index"."media" CASCADE;
  DROP TABLE "lumiere_index"."articles_sources" CASCADE;
  DROP TABLE "lumiere_index"."articles" CASCADE;
  DROP TABLE "lumiere_index"."articles_rels" CASCADE;
  DROP TABLE "lumiere_index"."_articles_v_version_sources" CASCADE;
  DROP TABLE "lumiere_index"."_articles_v" CASCADE;
  DROP TABLE "lumiere_index"."_articles_v_rels" CASCADE;
  DROP TABLE "lumiere_index"."payload_kv" CASCADE;
  DROP TABLE "lumiere_index"."payload_locked_documents" CASCADE;
  DROP TABLE "lumiere_index"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "lumiere_index"."payload_preferences" CASCADE;
  DROP TABLE "lumiere_index"."payload_preferences_rels" CASCADE;
  DROP TABLE "lumiere_index"."payload_migrations" CASCADE;
  DROP TYPE "lumiere_index"."enum_articles_status";
  DROP TYPE "lumiere_index"."enum__articles_v_version_status";`)
}
