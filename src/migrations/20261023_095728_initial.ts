import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA IF NOT EXISTS "elan";
  CREATE TYPE "elan"."media_aspect_ratio" AS ENUM('landscape', 'portrait', 'square', 'wide');
  CREATE TYPE "elan"."enum_articles_category" AS ENUM('culture', 'people', 'entertainment', 'style', 'life', 'places');
  CREATE TYPE "elan"."enum_articles_franchise" AS ENUM('new_guard', 'elan_conversations', 'portfolio', 'the_edit', 'after_dark', 'elan_50');
  CREATE TYPE "elan"."enum_articles_type" AS ENUM('standard', 'feature', 'interview');
  CREATE TYPE "elan"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "elan"."enum__articles_v_version_category" AS ENUM('culture', 'people', 'entertainment', 'style', 'life', 'places');
  CREATE TYPE "elan"."enum__articles_v_version_franchise" AS ENUM('new_guard', 'elan_conversations', 'portfolio', 'the_edit', 'after_dark', 'elan_50');
  CREATE TYPE "elan"."enum__articles_v_version_type" AS ENUM('standard', 'feature', 'interview');
  CREATE TYPE "elan"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "elan"."users_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "elan"."users" (
    "id" serial PRIMARY KEY NOT NULL,
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

  CREATE TABLE "elan"."authors" (
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "role" varchar NOT NULL,
    "avatar" varchar NOT NULL,
    "bio" varchar,
    "social_instagram" varchar,
    "social_twitter" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "elan"."articles_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "tag" varchar
  );

  CREATE TABLE "elan"."articles_blocks_paragraph" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar,
    "drop_cap" boolean,
    "block_name" varchar
  );

  CREATE TABLE "elan"."articles_blocks_heading" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar,
    "kicker" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."articles_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "quote" varchar,
    "attribution" varchar,
    "context" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."articles_blocks_image" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_url" varchar,
    "image_alt" varchar,
    "image_caption" varchar,
    "image_credit" varchar,
    "image_aspect_ratio" "elan"."media_aspect_ratio",
    "block_name" varchar
  );

  CREATE TABLE "elan"."articles_blocks_image_duo_images" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "url" varchar,
    "alt" varchar,
    "caption" varchar,
    "credit" varchar,
    "aspect_ratio" "elan"."media_aspect_ratio"
  );

  CREATE TABLE "elan"."articles_blocks_image_duo" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "elan"."articles_blocks_callout" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."articles_blocks_divider" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "block_name" varchar
  );

  CREATE TABLE "elan"."articles_interview_qas" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "speaker" varchar
  );

  CREATE TABLE "elan"."articles" (
    "id" varchar PRIMARY KEY NOT NULL,
    "slug" varchar,
    "title" varchar,
    "dek" varchar,
    "category" "elan"."enum_articles_category",
    "category_label" varchar,
    "franchise" "elan"."enum_articles_franchise",
    "author_id" varchar,
    "published_at" timestamp(3) with time zone,
    "date_formatted" varchar,
    "read_time" varchar,
    "cover_image_url" varchar,
    "cover_image_alt" varchar,
    "cover_image_caption" varchar,
    "cover_image_credit" varchar,
    "cover_image_aspect_ratio" "elan"."media_aspect_ratio",
    "type" "elan"."enum_articles_type",
    "is_lead" boolean,
    "is_editor_pick" boolean,
    "is_trending" boolean,
    "trending_rank" numeric,
    "art_direction_accent_hex" varchar DEFAULT '#6B2236',
    "art_direction_bg_override_hex" varchar,
    "art_direction_hero_focal_point_x" numeric DEFAULT 50,
    "art_direction_hero_focal_point_y" numeric DEFAULT 50,
    "interview_subject_name" varchar,
    "interview_subject_title" varchar,
    "interview_intro" varchar,
    "interview_portrait_url" varchar,
    "interview_portrait_alt" varchar,
    "interview_portrait_caption" varchar,
    "interview_portrait_credit" varchar,
    "interview_portrait_aspect_ratio" "elan"."media_aspect_ratio",
    "interview_secondary_portrait_url" varchar,
    "interview_secondary_portrait_alt" varchar,
    "interview_secondary_portrait_caption" varchar,
    "interview_secondary_portrait_credit" varchar,
    "interview_secondary_portrait_aspect_ratio" "elan"."media_aspect_ratio",
    "interview_key_quote" varchar,
    "interview_social_links_instagram" varchar,
    "interview_social_links_portfolio" varchar,
    "is_dev_mock" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "elan"."enum_articles_status" DEFAULT 'draft'
  );

  CREATE TABLE "elan"."_articles_v_version_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "tag" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "elan"."_articles_v_blocks_paragraph" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "drop_cap" boolean,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."_articles_v_blocks_heading" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "kicker" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."_articles_v_blocks_quote" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "quote" varchar,
    "attribution" varchar,
    "context" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."_articles_v_blocks_image" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_url" varchar,
    "image_alt" varchar,
    "image_caption" varchar,
    "image_credit" varchar,
    "image_aspect_ratio" "elan"."media_aspect_ratio",
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."_articles_v_blocks_image_duo_images" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "url" varchar,
    "alt" varchar,
    "caption" varchar,
    "credit" varchar,
    "aspect_ratio" "elan"."media_aspect_ratio",
    "_uuid" varchar
  );

  CREATE TABLE "elan"."_articles_v_blocks_image_duo" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."_articles_v_blocks_callout" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."_articles_v_blocks_divider" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE "elan"."_articles_v_version_interview_qas" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "speaker" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "elan"."_articles_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" varchar,
    "version_slug" varchar,
    "version_title" varchar,
    "version_dek" varchar,
    "version_category" "elan"."enum__articles_v_version_category",
    "version_category_label" varchar,
    "version_franchise" "elan"."enum__articles_v_version_franchise",
    "version_author_id" varchar,
    "version_published_at" timestamp(3) with time zone,
    "version_date_formatted" varchar,
    "version_read_time" varchar,
    "version_cover_image_url" varchar,
    "version_cover_image_alt" varchar,
    "version_cover_image_caption" varchar,
    "version_cover_image_credit" varchar,
    "version_cover_image_aspect_ratio" "elan"."media_aspect_ratio",
    "version_type" "elan"."enum__articles_v_version_type",
    "version_is_lead" boolean,
    "version_is_editor_pick" boolean,
    "version_is_trending" boolean,
    "version_trending_rank" numeric,
    "version_art_direction_accent_hex" varchar DEFAULT '#6B2236',
    "version_art_direction_bg_override_hex" varchar,
    "version_art_direction_hero_focal_point_x" numeric DEFAULT 50,
    "version_art_direction_hero_focal_point_y" numeric DEFAULT 50,
    "version_interview_subject_name" varchar,
    "version_interview_subject_title" varchar,
    "version_interview_intro" varchar,
    "version_interview_portrait_url" varchar,
    "version_interview_portrait_alt" varchar,
    "version_interview_portrait_caption" varchar,
    "version_interview_portrait_credit" varchar,
    "version_interview_portrait_aspect_ratio" "elan"."media_aspect_ratio",
    "version_interview_secondary_portrait_url" varchar,
    "version_interview_secondary_portrait_alt" varchar,
    "version_interview_secondary_portrait_caption" varchar,
    "version_interview_secondary_portrait_credit" varchar,
    "version_interview_secondary_portrait_aspect_ratio" "elan"."media_aspect_ratio",
    "version_interview_key_quote" varchar,
    "version_interview_social_links_instagram" varchar,
    "version_interview_social_links_portfolio" varchar,
    "version_is_dev_mock" boolean DEFAULT false,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "elan"."enum__articles_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "elan"."payload_kv" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "data" jsonb NOT NULL
  );

  CREATE TABLE "elan"."payload_locked_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "global_slug" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "elan"."payload_locked_documents_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer,
    "authors_id" varchar,
    "articles_id" varchar
  );

  CREATE TABLE "elan"."payload_preferences" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "elan"."payload_preferences_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer
  );

  CREATE TABLE "elan"."payload_migrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "batch" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "elan"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_tags" ADD CONSTRAINT "articles_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_paragraph" ADD CONSTRAINT "articles_blocks_paragraph_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_heading" ADD CONSTRAINT "articles_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_quote" ADD CONSTRAINT "articles_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_image" ADD CONSTRAINT "articles_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_image_duo_images" ADD CONSTRAINT "articles_blocks_image_duo_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles_blocks_image_duo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_image_duo" ADD CONSTRAINT "articles_blocks_image_duo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_callout" ADD CONSTRAINT "articles_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_blocks_divider" ADD CONSTRAINT "articles_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_interview_qas" ADD CONSTRAINT "articles_interview_qas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles" ADD CONSTRAINT "articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "elan"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_version_tags" ADD CONSTRAINT "_articles_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_paragraph" ADD CONSTRAINT "_articles_v_blocks_paragraph_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_heading" ADD CONSTRAINT "_articles_v_blocks_heading_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_quote" ADD CONSTRAINT "_articles_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_image" ADD CONSTRAINT "_articles_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_image_duo_images" ADD CONSTRAINT "_articles_v_blocks_image_duo_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v_blocks_image_duo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_image_duo" ADD CONSTRAINT "_articles_v_blocks_image_duo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_callout" ADD CONSTRAINT "_articles_v_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_blocks_divider" ADD CONSTRAINT "_articles_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_version_interview_qas" ADD CONSTRAINT "_articles_v_version_interview_qas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "elan"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "elan"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "elan"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "elan"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "elan"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "elan"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "elan"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "elan"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "elan"."users" USING btree ("email");
  CREATE INDEX "authors_updated_at_idx" ON "elan"."authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "elan"."authors" USING btree ("created_at");
  CREATE INDEX "articles_tags_order_idx" ON "elan"."articles_tags" USING btree ("_order");
  CREATE INDEX "articles_tags_parent_id_idx" ON "elan"."articles_tags" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_paragraph_order_idx" ON "elan"."articles_blocks_paragraph" USING btree ("_order");
  CREATE INDEX "articles_blocks_paragraph_parent_id_idx" ON "elan"."articles_blocks_paragraph" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_paragraph_path_idx" ON "elan"."articles_blocks_paragraph" USING btree ("_path");
  CREATE INDEX "articles_blocks_heading_order_idx" ON "elan"."articles_blocks_heading" USING btree ("_order");
  CREATE INDEX "articles_blocks_heading_parent_id_idx" ON "elan"."articles_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_heading_path_idx" ON "elan"."articles_blocks_heading" USING btree ("_path");
  CREATE INDEX "articles_blocks_quote_order_idx" ON "elan"."articles_blocks_quote" USING btree ("_order");
  CREATE INDEX "articles_blocks_quote_parent_id_idx" ON "elan"."articles_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_quote_path_idx" ON "elan"."articles_blocks_quote" USING btree ("_path");
  CREATE INDEX "articles_blocks_image_order_idx" ON "elan"."articles_blocks_image" USING btree ("_order");
  CREATE INDEX "articles_blocks_image_parent_id_idx" ON "elan"."articles_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_image_path_idx" ON "elan"."articles_blocks_image" USING btree ("_path");
  CREATE INDEX "articles_blocks_image_duo_images_order_idx" ON "elan"."articles_blocks_image_duo_images" USING btree ("_order");
  CREATE INDEX "articles_blocks_image_duo_images_parent_id_idx" ON "elan"."articles_blocks_image_duo_images" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_image_duo_order_idx" ON "elan"."articles_blocks_image_duo" USING btree ("_order");
  CREATE INDEX "articles_blocks_image_duo_parent_id_idx" ON "elan"."articles_blocks_image_duo" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_image_duo_path_idx" ON "elan"."articles_blocks_image_duo" USING btree ("_path");
  CREATE INDEX "articles_blocks_callout_order_idx" ON "elan"."articles_blocks_callout" USING btree ("_order");
  CREATE INDEX "articles_blocks_callout_parent_id_idx" ON "elan"."articles_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_callout_path_idx" ON "elan"."articles_blocks_callout" USING btree ("_path");
  CREATE INDEX "articles_blocks_divider_order_idx" ON "elan"."articles_blocks_divider" USING btree ("_order");
  CREATE INDEX "articles_blocks_divider_parent_id_idx" ON "elan"."articles_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_divider_path_idx" ON "elan"."articles_blocks_divider" USING btree ("_path");
  CREATE INDEX "articles_interview_qas_order_idx" ON "elan"."articles_interview_qas" USING btree ("_order");
  CREATE INDEX "articles_interview_qas_parent_id_idx" ON "elan"."articles_interview_qas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "elan"."articles" USING btree ("slug");
  CREATE INDEX "articles_author_idx" ON "elan"."articles" USING btree ("author_id");
  CREATE INDEX "articles_updated_at_idx" ON "elan"."articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "elan"."articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "elan"."articles" USING btree ("_status");
  CREATE INDEX "_articles_v_version_tags_order_idx" ON "elan"."_articles_v_version_tags" USING btree ("_order");
  CREATE INDEX "_articles_v_version_tags_parent_id_idx" ON "elan"."_articles_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_paragraph_order_idx" ON "elan"."_articles_v_blocks_paragraph" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_paragraph_parent_id_idx" ON "elan"."_articles_v_blocks_paragraph" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_paragraph_path_idx" ON "elan"."_articles_v_blocks_paragraph" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_heading_order_idx" ON "elan"."_articles_v_blocks_heading" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_heading_parent_id_idx" ON "elan"."_articles_v_blocks_heading" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_heading_path_idx" ON "elan"."_articles_v_blocks_heading" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_quote_order_idx" ON "elan"."_articles_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_quote_parent_id_idx" ON "elan"."_articles_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_quote_path_idx" ON "elan"."_articles_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_image_order_idx" ON "elan"."_articles_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_image_parent_id_idx" ON "elan"."_articles_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_image_path_idx" ON "elan"."_articles_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_image_duo_images_order_idx" ON "elan"."_articles_v_blocks_image_duo_images" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_image_duo_images_parent_id_idx" ON "elan"."_articles_v_blocks_image_duo_images" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_image_duo_order_idx" ON "elan"."_articles_v_blocks_image_duo" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_image_duo_parent_id_idx" ON "elan"."_articles_v_blocks_image_duo" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_image_duo_path_idx" ON "elan"."_articles_v_blocks_image_duo" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_callout_order_idx" ON "elan"."_articles_v_blocks_callout" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_callout_parent_id_idx" ON "elan"."_articles_v_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_callout_path_idx" ON "elan"."_articles_v_blocks_callout" USING btree ("_path");
  CREATE INDEX "_articles_v_blocks_divider_order_idx" ON "elan"."_articles_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_divider_parent_id_idx" ON "elan"."_articles_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_divider_path_idx" ON "elan"."_articles_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_articles_v_version_interview_qas_order_idx" ON "elan"."_articles_v_version_interview_qas" USING btree ("_order");
  CREATE INDEX "_articles_v_version_interview_qas_parent_id_idx" ON "elan"."_articles_v_version_interview_qas" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "elan"."_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "elan"."_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "elan"."_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "elan"."_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "elan"."_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "elan"."_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "elan"."_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "elan"."_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "elan"."_articles_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "elan"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "elan"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "elan"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "elan"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "elan"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "elan"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "elan"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "elan"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "elan"."payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "elan"."payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_preferences_key_idx" ON "elan"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "elan"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "elan"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "elan"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "elan"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "elan"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "elan"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "elan"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "elan"."payload_migrations" USING btree ("created_at");
  REVOKE ALL ON SCHEMA "elan" FROM PUBLIC;
  REVOKE ALL ON ALL TABLES IN SCHEMA "elan" FROM PUBLIC;
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      REVOKE ALL ON SCHEMA "elan" FROM anon;
      REVOKE ALL ON ALL TABLES IN SCHEMA "elan" FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      REVOKE ALL ON SCHEMA "elan" FROM authenticated;
      REVOKE ALL ON ALL TABLES IN SCHEMA "elan" FROM authenticated;
    END IF;
  END $$;
`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "elan"."users_sessions" CASCADE;
  DROP TABLE "elan"."users" CASCADE;
  DROP TABLE "elan"."authors" CASCADE;
  DROP TABLE "elan"."articles_tags" CASCADE;
  DROP TABLE "elan"."articles_blocks_paragraph" CASCADE;
  DROP TABLE "elan"."articles_blocks_heading" CASCADE;
  DROP TABLE "elan"."articles_blocks_quote" CASCADE;
  DROP TABLE "elan"."articles_blocks_image" CASCADE;
  DROP TABLE "elan"."articles_blocks_image_duo_images" CASCADE;
  DROP TABLE "elan"."articles_blocks_image_duo" CASCADE;
  DROP TABLE "elan"."articles_blocks_callout" CASCADE;
  DROP TABLE "elan"."articles_blocks_divider" CASCADE;
  DROP TABLE "elan"."articles_interview_qas" CASCADE;
  DROP TABLE "elan"."articles" CASCADE;
  DROP TABLE "elan"."_articles_v_version_tags" CASCADE;
  DROP TABLE "elan"."_articles_v_blocks_paragraph" CASCADE;
  DROP TABLE "elan"."_articles_v_blocks_heading" CASCADE;
  DROP TABLE "elan"."_articles_v_blocks_quote" CASCADE;
  DROP TABLE "elan"."_articles_v_blocks_image" CASCADE;
  DROP TABLE "elan"."_articles_v_blocks_image_duo_images" CASCADE;
  DROP TABLE "elan"."_articles_v_blocks_image_duo" CASCADE;
  DROP TABLE "elan"."_articles_v_blocks_callout" CASCADE;
  DROP TABLE "elan"."_articles_v_blocks_divider" CASCADE;
  DROP TABLE "elan"."_articles_v_version_interview_qas" CASCADE;
  DROP TABLE "elan"."_articles_v" CASCADE;
  DROP TABLE "elan"."payload_kv" CASCADE;
  DROP TABLE "elan"."payload_locked_documents" CASCADE;
  DROP TABLE "elan"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "elan"."payload_preferences" CASCADE;
  DROP TABLE "elan"."payload_preferences_rels" CASCADE;
  DROP TABLE "elan"."payload_migrations" CASCADE;
  DROP TYPE "elan"."media_aspect_ratio";
  DROP TYPE "elan"."enum_articles_category";
  DROP TYPE "elan"."enum_articles_franchise";
  DROP TYPE "elan"."enum_articles_type";
  DROP TYPE "elan"."enum_articles_status";
  DROP TYPE "elan"."enum__articles_v_version_category";
  DROP TYPE "elan"."enum__articles_v_version_franchise";
  DROP TYPE "elan"."enum__articles_v_version_type";
  DROP TYPE "elan"."enum__articles_v_version_status";`)
}
