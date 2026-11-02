import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "elan"."enum_personalities_status" AS ENUM('draft', 'published');
  CREATE TYPE "elan"."enum__personalities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "elan"."enum_covers_status" AS ENUM('draft', 'published');
  CREATE TYPE "elan"."enum__covers_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "elan"."enum_articles_franchise" ADD VALUE 'off_camera' BEFORE 'portfolio';
  ALTER TYPE "elan"."enum_articles_franchise" ADD VALUE 'originals' BEFORE 'portfolio';
  ALTER TYPE "elan"."enum_articles_franchise" ADD VALUE 'culture_edit' BEFORE 'portfolio';
  ALTER TYPE "elan"."enum_articles_type" ADD VALUE 'original';
  ALTER TYPE "elan"."enum__articles_v_version_franchise" ADD VALUE 'off_camera' BEFORE 'portfolio';
  ALTER TYPE "elan"."enum__articles_v_version_franchise" ADD VALUE 'originals' BEFORE 'portfolio';
  ALTER TYPE "elan"."enum__articles_v_version_franchise" ADD VALUE 'culture_edit' BEFORE 'portfolio';
  ALTER TYPE "elan"."enum__articles_v_version_type" ADD VALUE 'original';
  CREATE TABLE "elan"."articles_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"asset_id" integer,
  	"url" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"aspect_ratio" "elan"."media_aspect_ratio"
  );
  
  CREATE TABLE "elan"."articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"personalities_id" integer
  );
  
  CREATE TABLE "elan"."_articles_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"asset_id" integer,
  	"url" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"aspect_ratio" "elan"."media_aspect_ratio",
  	"_uuid" varchar
  );
  
  CREATE TABLE "elan"."_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"personalities_id" integer
  );
  
  CREATE TABLE "elan"."personalities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"profession" varchar,
  	"bio" varchar,
  	"portrait_asset_id" integer,
  	"portrait_url" varchar,
  	"portrait_alt" varchar,
  	"portrait_caption" varchar,
  	"portrait_credit" varchar,
  	"portrait_aspect_ratio" "elan"."media_aspect_ratio",
  	"social_instagram" varchar,
  	"social_website" varchar,
  	"published_at" timestamp(3) with time zone,
  	"is_dev_mock" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "elan"."enum_personalities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "elan"."_personalities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_profession" varchar,
  	"version_bio" varchar,
  	"version_portrait_asset_id" integer,
  	"version_portrait_url" varchar,
  	"version_portrait_alt" varchar,
  	"version_portrait_caption" varchar,
  	"version_portrait_credit" varchar,
  	"version_portrait_aspect_ratio" "elan"."media_aspect_ratio",
  	"version_social_instagram" varchar,
  	"version_social_website" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_is_dev_mock" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "elan"."enum__personalities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "elan"."covers_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"artwork_asset_id" integer,
  	"artwork_url" varchar,
  	"artwork_alt" varchar,
  	"artwork_caption" varchar,
  	"artwork_credit" varchar,
  	"artwork_aspect_ratio" "elan"."media_aspect_ratio"
  );
  
  CREATE TABLE "elan"."covers_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"asset_id" integer,
  	"url" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"aspect_ratio" "elan"."media_aspect_ratio"
  );
  
  CREATE TABLE "elan"."covers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"issue_identifier" varchar,
  	"intro" varchar,
  	"artwork_asset_id" integer,
  	"artwork_url" varchar,
  	"artwork_alt" varchar,
  	"artwork_caption" varchar,
  	"artwork_credit" varchar,
  	"artwork_aspect_ratio" "elan"."media_aspect_ratio",
  	"story_id" varchar,
  	"production_video_url" varchar,
  	"production_description" varchar,
  	"production_credits" varchar,
  	"production_duration" varchar,
  	"behind_the_scenes" varchar,
  	"is_homepage" boolean,
  	"sponsorship_sponsored" boolean,
  	"sponsorship_partner" varchar,
  	"sponsorship_disclosure" varchar,
  	"published_at" timestamp(3) with time zone,
  	"is_dev_mock" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "elan"."enum_covers_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "elan"."covers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"personalities_id" integer,
  	"articles_id" varchar
  );
  
  CREATE TABLE "elan"."_covers_v_version_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"artwork_asset_id" integer,
  	"artwork_url" varchar,
  	"artwork_alt" varchar,
  	"artwork_caption" varchar,
  	"artwork_credit" varchar,
  	"artwork_aspect_ratio" "elan"."media_aspect_ratio",
  	"_uuid" varchar
  );
  
  CREATE TABLE "elan"."_covers_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"asset_id" integer,
  	"url" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"aspect_ratio" "elan"."media_aspect_ratio",
  	"_uuid" varchar
  );
  
  CREATE TABLE "elan"."_covers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_issue_identifier" varchar,
  	"version_intro" varchar,
  	"version_artwork_asset_id" integer,
  	"version_artwork_url" varchar,
  	"version_artwork_alt" varchar,
  	"version_artwork_caption" varchar,
  	"version_artwork_credit" varchar,
  	"version_artwork_aspect_ratio" "elan"."media_aspect_ratio",
  	"version_story_id" varchar,
  	"version_production_video_url" varchar,
  	"version_production_description" varchar,
  	"version_production_credits" varchar,
  	"version_production_duration" varchar,
  	"version_behind_the_scenes" varchar,
  	"version_is_homepage" boolean,
  	"version_sponsorship_sponsored" boolean,
  	"version_sponsorship_partner" varchar,
  	"version_sponsorship_disclosure" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_is_dev_mock" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "elan"."enum__covers_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "elan"."_covers_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"personalities_id" integer,
  	"articles_id" varchar
  );
  
  ALTER TYPE "elan"."enum_articles_category" ADD VALUE 'music';
  ALTER TYPE "elan"."enum__articles_v_version_category" ADD VALUE 'music';
  ALTER TABLE "elan"."articles" ADD COLUMN "production_video_url" varchar;
  ALTER TABLE "elan"."articles" ADD COLUMN "production_description" varchar;
  ALTER TABLE "elan"."articles" ADD COLUMN "production_credits" varchar;
  ALTER TABLE "elan"."articles" ADD COLUMN "production_duration" varchar;
  ALTER TABLE "elan"."articles" ADD COLUMN "sponsorship_sponsored" boolean;
  ALTER TABLE "elan"."articles" ADD COLUMN "sponsorship_partner" varchar;
  ALTER TABLE "elan"."articles" ADD COLUMN "sponsorship_disclosure" varchar;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_production_video_url" varchar;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_production_description" varchar;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_production_credits" varchar;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_production_duration" varchar;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_sponsorship_sponsored" boolean;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_sponsorship_partner" varchar;
  ALTER TABLE "elan"."_articles_v" ADD COLUMN "version_sponsorship_disclosure" varchar;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD COLUMN "personalities_id" integer;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD COLUMN "covers_id" integer;
  ALTER TABLE "elan"."articles_gallery" ADD CONSTRAINT "articles_gallery_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."articles_gallery" ADD CONSTRAINT "articles_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."articles_rels" ADD CONSTRAINT "articles_rels_personalities_fk" FOREIGN KEY ("personalities_id") REFERENCES "elan"."personalities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_version_gallery" ADD CONSTRAINT "_articles_v_version_gallery_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_version_gallery" ADD CONSTRAINT "_articles_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_personalities_fk" FOREIGN KEY ("personalities_id") REFERENCES "elan"."personalities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."personalities" ADD CONSTRAINT "personalities_portrait_asset_id_media_id_fk" FOREIGN KEY ("portrait_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_personalities_v" ADD CONSTRAINT "_personalities_v_parent_id_personalities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."personalities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_personalities_v" ADD CONSTRAINT "_personalities_v_version_portrait_asset_id_media_id_fk" FOREIGN KEY ("version_portrait_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."covers_variants" ADD CONSTRAINT "covers_variants_artwork_asset_id_media_id_fk" FOREIGN KEY ("artwork_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."covers_variants" ADD CONSTRAINT "covers_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."covers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."covers_gallery" ADD CONSTRAINT "covers_gallery_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."covers_gallery" ADD CONSTRAINT "covers_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."covers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."covers" ADD CONSTRAINT "covers_artwork_asset_id_media_id_fk" FOREIGN KEY ("artwork_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."covers" ADD CONSTRAINT "covers_story_id_articles_id_fk" FOREIGN KEY ("story_id") REFERENCES "elan"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."covers_rels" ADD CONSTRAINT "covers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."covers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."covers_rels" ADD CONSTRAINT "covers_rels_personalities_fk" FOREIGN KEY ("personalities_id") REFERENCES "elan"."personalities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."covers_rels" ADD CONSTRAINT "covers_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v_version_variants" ADD CONSTRAINT "_covers_v_version_variants_artwork_asset_id_media_id_fk" FOREIGN KEY ("artwork_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v_version_variants" ADD CONSTRAINT "_covers_v_version_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_covers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v_version_gallery" ADD CONSTRAINT "_covers_v_version_gallery_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v_version_gallery" ADD CONSTRAINT "_covers_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "elan"."_covers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v" ADD CONSTRAINT "_covers_v_parent_id_covers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."covers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v" ADD CONSTRAINT "_covers_v_version_artwork_asset_id_media_id_fk" FOREIGN KEY ("version_artwork_asset_id") REFERENCES "elan"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v" ADD CONSTRAINT "_covers_v_version_story_id_articles_id_fk" FOREIGN KEY ("version_story_id") REFERENCES "elan"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v_rels" ADD CONSTRAINT "_covers_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "elan"."_covers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v_rels" ADD CONSTRAINT "_covers_v_rels_personalities_fk" FOREIGN KEY ("personalities_id") REFERENCES "elan"."personalities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."_covers_v_rels" ADD CONSTRAINT "_covers_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "elan"."articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_gallery_order_idx" ON "elan"."articles_gallery" USING btree ("_order");
  CREATE INDEX "articles_gallery_parent_id_idx" ON "elan"."articles_gallery" USING btree ("_parent_id");
  CREATE INDEX "articles_gallery_asset_idx" ON "elan"."articles_gallery" USING btree ("asset_id");
  CREATE INDEX "articles_rels_order_idx" ON "elan"."articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "elan"."articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "elan"."articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_personalities_id_idx" ON "elan"."articles_rels" USING btree ("personalities_id");
  CREATE INDEX "_articles_v_version_gallery_order_idx" ON "elan"."_articles_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_articles_v_version_gallery_parent_id_idx" ON "elan"."_articles_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_version_gallery_asset_idx" ON "elan"."_articles_v_version_gallery" USING btree ("asset_id");
  CREATE INDEX "_articles_v_rels_order_idx" ON "elan"."_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "elan"."_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "elan"."_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_personalities_id_idx" ON "elan"."_articles_v_rels" USING btree ("personalities_id");
  CREATE UNIQUE INDEX "personalities_slug_idx" ON "elan"."personalities" USING btree ("slug");
  CREATE INDEX "personalities_portrait_portrait_asset_idx" ON "elan"."personalities" USING btree ("portrait_asset_id");
  CREATE INDEX "personalities_published_at_idx" ON "elan"."personalities" USING btree ("published_at");
  CREATE INDEX "personalities_updated_at_idx" ON "elan"."personalities" USING btree ("updated_at");
  CREATE INDEX "personalities_created_at_idx" ON "elan"."personalities" USING btree ("created_at");
  CREATE INDEX "personalities__status_idx" ON "elan"."personalities" USING btree ("_status");
  CREATE INDEX "_personalities_v_parent_idx" ON "elan"."_personalities_v" USING btree ("parent_id");
  CREATE INDEX "_personalities_v_version_version_slug_idx" ON "elan"."_personalities_v" USING btree ("version_slug");
  CREATE INDEX "_personalities_v_version_portrait_version_portrait_asset_idx" ON "elan"."_personalities_v" USING btree ("version_portrait_asset_id");
  CREATE INDEX "_personalities_v_version_version_published_at_idx" ON "elan"."_personalities_v" USING btree ("version_published_at");
  CREATE INDEX "_personalities_v_version_version_updated_at_idx" ON "elan"."_personalities_v" USING btree ("version_updated_at");
  CREATE INDEX "_personalities_v_version_version_created_at_idx" ON "elan"."_personalities_v" USING btree ("version_created_at");
  CREATE INDEX "_personalities_v_version_version__status_idx" ON "elan"."_personalities_v" USING btree ("version__status");
  CREATE INDEX "_personalities_v_created_at_idx" ON "elan"."_personalities_v" USING btree ("created_at");
  CREATE INDEX "_personalities_v_updated_at_idx" ON "elan"."_personalities_v" USING btree ("updated_at");
  CREATE INDEX "_personalities_v_latest_idx" ON "elan"."_personalities_v" USING btree ("latest");
  CREATE INDEX "covers_variants_order_idx" ON "elan"."covers_variants" USING btree ("_order");
  CREATE INDEX "covers_variants_parent_id_idx" ON "elan"."covers_variants" USING btree ("_parent_id");
  CREATE INDEX "covers_variants_artwork_artwork_asset_idx" ON "elan"."covers_variants" USING btree ("artwork_asset_id");
  CREATE INDEX "covers_gallery_order_idx" ON "elan"."covers_gallery" USING btree ("_order");
  CREATE INDEX "covers_gallery_parent_id_idx" ON "elan"."covers_gallery" USING btree ("_parent_id");
  CREATE INDEX "covers_gallery_asset_idx" ON "elan"."covers_gallery" USING btree ("asset_id");
  CREATE UNIQUE INDEX "covers_slug_idx" ON "elan"."covers" USING btree ("slug");
  CREATE INDEX "covers_artwork_artwork_asset_idx" ON "elan"."covers" USING btree ("artwork_asset_id");
  CREATE INDEX "covers_story_idx" ON "elan"."covers" USING btree ("story_id");
  CREATE INDEX "covers_published_at_idx" ON "elan"."covers" USING btree ("published_at");
  CREATE INDEX "covers_updated_at_idx" ON "elan"."covers" USING btree ("updated_at");
  CREATE INDEX "covers_created_at_idx" ON "elan"."covers" USING btree ("created_at");
  CREATE INDEX "covers__status_idx" ON "elan"."covers" USING btree ("_status");
  CREATE INDEX "covers_rels_order_idx" ON "elan"."covers_rels" USING btree ("order");
  CREATE INDEX "covers_rels_parent_idx" ON "elan"."covers_rels" USING btree ("parent_id");
  CREATE INDEX "covers_rels_path_idx" ON "elan"."covers_rels" USING btree ("path");
  CREATE INDEX "covers_rels_personalities_id_idx" ON "elan"."covers_rels" USING btree ("personalities_id");
  CREATE INDEX "covers_rels_articles_id_idx" ON "elan"."covers_rels" USING btree ("articles_id");
  CREATE INDEX "_covers_v_version_variants_order_idx" ON "elan"."_covers_v_version_variants" USING btree ("_order");
  CREATE INDEX "_covers_v_version_variants_parent_id_idx" ON "elan"."_covers_v_version_variants" USING btree ("_parent_id");
  CREATE INDEX "_covers_v_version_variants_artwork_artwork_asset_idx" ON "elan"."_covers_v_version_variants" USING btree ("artwork_asset_id");
  CREATE INDEX "_covers_v_version_gallery_order_idx" ON "elan"."_covers_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_covers_v_version_gallery_parent_id_idx" ON "elan"."_covers_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_covers_v_version_gallery_asset_idx" ON "elan"."_covers_v_version_gallery" USING btree ("asset_id");
  CREATE INDEX "_covers_v_parent_idx" ON "elan"."_covers_v" USING btree ("parent_id");
  CREATE INDEX "_covers_v_version_version_slug_idx" ON "elan"."_covers_v" USING btree ("version_slug");
  CREATE INDEX "_covers_v_version_artwork_version_artwork_asset_idx" ON "elan"."_covers_v" USING btree ("version_artwork_asset_id");
  CREATE INDEX "_covers_v_version_version_story_idx" ON "elan"."_covers_v" USING btree ("version_story_id");
  CREATE INDEX "_covers_v_version_version_published_at_idx" ON "elan"."_covers_v" USING btree ("version_published_at");
  CREATE INDEX "_covers_v_version_version_updated_at_idx" ON "elan"."_covers_v" USING btree ("version_updated_at");
  CREATE INDEX "_covers_v_version_version_created_at_idx" ON "elan"."_covers_v" USING btree ("version_created_at");
  CREATE INDEX "_covers_v_version_version__status_idx" ON "elan"."_covers_v" USING btree ("version__status");
  CREATE INDEX "_covers_v_created_at_idx" ON "elan"."_covers_v" USING btree ("created_at");
  CREATE INDEX "_covers_v_updated_at_idx" ON "elan"."_covers_v" USING btree ("updated_at");
  CREATE INDEX "_covers_v_latest_idx" ON "elan"."_covers_v" USING btree ("latest");
  CREATE INDEX "_covers_v_rels_order_idx" ON "elan"."_covers_v_rels" USING btree ("order");
  CREATE INDEX "_covers_v_rels_parent_idx" ON "elan"."_covers_v_rels" USING btree ("parent_id");
  CREATE INDEX "_covers_v_rels_path_idx" ON "elan"."_covers_v_rels" USING btree ("path");
  CREATE INDEX "_covers_v_rels_personalities_id_idx" ON "elan"."_covers_v_rels" USING btree ("personalities_id");
  CREATE INDEX "_covers_v_rels_articles_id_idx" ON "elan"."_covers_v_rels" USING btree ("articles_id");
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_personalities_fk" FOREIGN KEY ("personalities_id") REFERENCES "elan"."personalities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_covers_fk" FOREIGN KEY ("covers_id") REFERENCES "elan"."covers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_published_at_idx" ON "elan"."articles" USING btree ("published_at");
  CREATE INDEX "_articles_v_version_version_published_at_idx" ON "elan"."_articles_v" USING btree ("version_published_at");
  CREATE INDEX "payload_locked_documents_rels_personalities_id_idx" ON "elan"."payload_locked_documents_rels" USING btree ("personalities_id");
  CREATE INDEX "payload_locked_documents_rels_covers_id_idx" ON "elan"."payload_locked_documents_rels" USING btree ("covers_id");
  ALTER TABLE "elan"."articles_gallery" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."articles_rels" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_articles_v_version_gallery" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_articles_v_rels" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."personalities" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_personalities_v" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."covers_variants" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."covers_gallery" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."covers" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."covers_rels" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_covers_v_version_variants" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_covers_v_version_gallery" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_covers_v" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_covers_v_rels" ENABLE ROW LEVEL SECURITY;
  REVOKE ALL ON ALL TABLES IN SCHEMA "elan" FROM PUBLIC;
  REVOKE ALL ON ALL SEQUENCES IN SCHEMA "elan" FROM PUBLIC;
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA elan FROM anon';
      EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA elan FROM anon';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA elan FROM authenticated';
      EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA elan FROM authenticated';
    END IF;
  END $$;
  UPDATE "elan"."articles" SET "is_dev_mock" = true WHERE "cover_image_credit" ILIKE '%[Development Mock]%';
  UPDATE "elan"."_articles_v" SET "version_is_dev_mock" = true WHERE "version_cover_image_credit" ILIKE '%[Development Mock]%';
`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "elan"."articles_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."articles_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_articles_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_articles_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."personalities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_personalities_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."covers_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."covers_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."covers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."covers_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_covers_v_version_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_covers_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_covers_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."_covers_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "elan"."articles_gallery" CASCADE;
  DROP TABLE "elan"."articles_rels" CASCADE;
  DROP TABLE "elan"."_articles_v_version_gallery" CASCADE;
  DROP TABLE "elan"."_articles_v_rels" CASCADE;
  DROP TABLE "elan"."personalities" CASCADE;
  DROP TABLE "elan"."_personalities_v" CASCADE;
  DROP TABLE "elan"."covers_variants" CASCADE;
  DROP TABLE "elan"."covers_gallery" CASCADE;
  DROP TABLE "elan"."covers" CASCADE;
  DROP TABLE "elan"."covers_rels" CASCADE;
  DROP TABLE "elan"."_covers_v_version_variants" CASCADE;
  DROP TABLE "elan"."_covers_v_version_gallery" CASCADE;
  DROP TABLE "elan"."_covers_v" CASCADE;
  DROP TABLE "elan"."_covers_v_rels" CASCADE;
  ALTER TABLE "elan"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_personalities_fk";
  
  ALTER TABLE "elan"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_covers_fk";
  
  ALTER TABLE "elan"."articles" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "elan"."enum_articles_category";
  CREATE TYPE "elan"."enum_articles_category" AS ENUM('culture', 'people', 'entertainment', 'style', 'life', 'places');
  ALTER TABLE "elan"."articles" ALTER COLUMN "category" SET DATA TYPE "elan"."enum_articles_category" USING "category"::"elan"."enum_articles_category";
  ALTER TABLE "elan"."articles" ALTER COLUMN "franchise" SET DATA TYPE text;
  DROP TYPE "elan"."enum_articles_franchise";
  CREATE TYPE "elan"."enum_articles_franchise" AS ENUM('new_guard', 'elan_conversations', 'portfolio', 'the_edit', 'after_dark', 'elan_50');
  ALTER TABLE "elan"."articles" ALTER COLUMN "franchise" SET DATA TYPE "elan"."enum_articles_franchise" USING "franchise"::"elan"."enum_articles_franchise";
  ALTER TABLE "elan"."articles" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "elan"."enum_articles_type";
  CREATE TYPE "elan"."enum_articles_type" AS ENUM('standard', 'feature', 'interview');
  ALTER TABLE "elan"."articles" ALTER COLUMN "type" SET DATA TYPE "elan"."enum_articles_type" USING "type"::"elan"."enum_articles_type";
  ALTER TABLE "elan"."_articles_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE "elan"."enum__articles_v_version_category";
  CREATE TYPE "elan"."enum__articles_v_version_category" AS ENUM('culture', 'people', 'entertainment', 'style', 'life', 'places');
  ALTER TABLE "elan"."_articles_v" ALTER COLUMN "version_category" SET DATA TYPE "elan"."enum__articles_v_version_category" USING "version_category"::"elan"."enum__articles_v_version_category";
  ALTER TABLE "elan"."_articles_v" ALTER COLUMN "version_franchise" SET DATA TYPE text;
  DROP TYPE "elan"."enum__articles_v_version_franchise";
  CREATE TYPE "elan"."enum__articles_v_version_franchise" AS ENUM('new_guard', 'elan_conversations', 'portfolio', 'the_edit', 'after_dark', 'elan_50');
  ALTER TABLE "elan"."_articles_v" ALTER COLUMN "version_franchise" SET DATA TYPE "elan"."enum__articles_v_version_franchise" USING "version_franchise"::"elan"."enum__articles_v_version_franchise";
  ALTER TABLE "elan"."_articles_v" ALTER COLUMN "version_type" SET DATA TYPE text;
  DROP TYPE "elan"."enum__articles_v_version_type";
  CREATE TYPE "elan"."enum__articles_v_version_type" AS ENUM('standard', 'feature', 'interview');
  ALTER TABLE "elan"."_articles_v" ALTER COLUMN "version_type" SET DATA TYPE "elan"."enum__articles_v_version_type" USING "version_type"::"elan"."enum__articles_v_version_type";
  DROP INDEX "elan"."articles_published_at_idx";
  DROP INDEX "elan"."_articles_v_version_version_published_at_idx";
  DROP INDEX "elan"."payload_locked_documents_rels_personalities_id_idx";
  DROP INDEX "elan"."payload_locked_documents_rels_covers_id_idx";
  ALTER TABLE "elan"."articles" DROP COLUMN "production_video_url";
  ALTER TABLE "elan"."articles" DROP COLUMN "production_description";
  ALTER TABLE "elan"."articles" DROP COLUMN "production_credits";
  ALTER TABLE "elan"."articles" DROP COLUMN "production_duration";
  ALTER TABLE "elan"."articles" DROP COLUMN "sponsorship_sponsored";
  ALTER TABLE "elan"."articles" DROP COLUMN "sponsorship_partner";
  ALTER TABLE "elan"."articles" DROP COLUMN "sponsorship_disclosure";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_production_video_url";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_production_description";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_production_credits";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_production_duration";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_sponsorship_sponsored";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_sponsorship_partner";
  ALTER TABLE "elan"."_articles_v" DROP COLUMN "version_sponsorship_disclosure";
  ALTER TABLE "elan"."payload_locked_documents_rels" DROP COLUMN "personalities_id";
  ALTER TABLE "elan"."payload_locked_documents_rels" DROP COLUMN "covers_id";
  DROP TYPE "elan"."enum_personalities_status";
  DROP TYPE "elan"."enum__personalities_v_version_status";
  DROP TYPE "elan"."enum_covers_status";
  DROP TYPE "elan"."enum__covers_v_version_status";`)
}
