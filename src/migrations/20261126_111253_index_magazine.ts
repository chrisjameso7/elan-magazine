import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "lumiere_index"."enum_articles_verdict" AS ENUM('obsessed', 'on-repeat', 'fine', 'skip');
  CREATE TYPE "lumiere_index"."enum__articles_v_version_verdict" AS ENUM('obsessed', 'on-repeat', 'fine', 'skip');
  CREATE TYPE "lumiere_index"."enum_index_entries_category" AS ENUM('music', 'film-tv', 'internet', 'style', 'books', 'art', 'sport', 'gaming', 'culture');
  CREATE TYPE "lumiere_index"."enum_index_entries_movement" AS ENUM('new', 'up', 'down', 'same');
  CREATE TYPE "lumiere_index"."enum_tips_status" AS ENUM('new', 'listening', 'covered', 'passed');
  CREATE TABLE "lumiere_index"."index_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"week" timestamp(3) with time zone NOT NULL,
  	"rank" numeric NOT NULL,
  	"name" varchar NOT NULL,
  	"category" "lumiere_index"."enum_index_entries_category" DEFAULT 'music' NOT NULL,
  	"why" varchar NOT NULL,
  	"movement" "lumiere_index"."enum_index_entries_movement" DEFAULT 'new' NOT NULL,
  	"places" numeric,
  	"story_id" integer,
  	"is_published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."discoveries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"story_id" integer,
  	"first_covered_at" timestamp(3) with time zone NOT NULL,
  	"metric_label" varchar,
  	"metric_then" varchar,
  	"metric_now" varchar,
  	"is_published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."tips" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"why" varchar,
  	"is_self" boolean DEFAULT false,
  	"email" varchar,
  	"status" "lumiere_index"."enum_tips_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "lumiere_index"."articles" ADD COLUMN "verdict" "lumiere_index"."enum_articles_verdict";
  ALTER TABLE "lumiere_index"."_articles_v" ADD COLUMN "version_verdict" "lumiere_index"."enum__articles_v_version_verdict";
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD COLUMN "index_entries_id" integer;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD COLUMN "discoveries_id" integer;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD COLUMN "tips_id" integer;
  ALTER TABLE "lumiere_index"."index_entries" ADD CONSTRAINT "index_entries_story_id_articles_id_fk" FOREIGN KEY ("story_id") REFERENCES "lumiere_index"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lumiere_index"."discoveries" ADD CONSTRAINT "discoveries_story_id_articles_id_fk" FOREIGN KEY ("story_id") REFERENCES "lumiere_index"."articles"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "index_entries_week_idx" ON "lumiere_index"."index_entries" USING btree ("week");
  CREATE INDEX "index_entries_story_idx" ON "lumiere_index"."index_entries" USING btree ("story_id");
  CREATE INDEX "index_entries_is_published_idx" ON "lumiere_index"."index_entries" USING btree ("is_published");
  CREATE INDEX "index_entries_updated_at_idx" ON "lumiere_index"."index_entries" USING btree ("updated_at");
  CREATE INDEX "index_entries_created_at_idx" ON "lumiere_index"."index_entries" USING btree ("created_at");
  CREATE INDEX "discoveries_story_idx" ON "lumiere_index"."discoveries" USING btree ("story_id");
  CREATE INDEX "discoveries_is_published_idx" ON "lumiere_index"."discoveries" USING btree ("is_published");
  CREATE INDEX "discoveries_updated_at_idx" ON "lumiere_index"."discoveries" USING btree ("updated_at");
  CREATE INDEX "discoveries_created_at_idx" ON "lumiere_index"."discoveries" USING btree ("created_at");
  CREATE INDEX "tips_updated_at_idx" ON "lumiere_index"."tips" USING btree ("updated_at");
  CREATE INDEX "tips_created_at_idx" ON "lumiere_index"."tips" USING btree ("created_at");
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_index_entries_fk" FOREIGN KEY ("index_entries_id") REFERENCES "lumiere_index"."index_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_discoveries_fk" FOREIGN KEY ("discoveries_id") REFERENCES "lumiere_index"."discoveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tips_fk" FOREIGN KEY ("tips_id") REFERENCES "lumiere_index"."tips"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_index_entries_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("index_entries_id");
  CREATE INDEX "payload_locked_documents_rels_discoveries_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("discoveries_id");
  CREATE INDEX "payload_locked_documents_rels_tips_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("tips_id");
  INSERT INTO "lumiere_index"."sections" ("name","slug","description","nav_order")
  VALUES
    ('Discover','discover','First listens and first looks: the people we think are next.',1),
    ('Critique','critique','Reviews with a verdict: Obsessed, On repeat, It''s fine or Skip.',2),
    ('Personal','personal','First-person essays about the culture that shaped us.',3)
  ON CONFLICT ("slug") DO NOTHING;
  REVOKE ALL ON SCHEMA lumiere_index FROM PUBLIC;
  REVOKE ALL ON ALL TABLES IN SCHEMA lumiere_index FROM PUBLIC;
  REVOKE ALL ON ALL SEQUENCES IN SCHEMA lumiere_index FROM PUBLIC;
  DO $$ DECLARE target record; BEGIN
    FOR target IN SELECT tablename FROM pg_tables WHERE schemaname = 'lumiere_index' LOOP
      EXECUTE format('ALTER TABLE lumiere_index.%I ENABLE ROW LEVEL SECURITY', target.tablename);
    END LOOP;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA lumiere_index FROM anon';
      EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA lumiere_index FROM anon';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA lumiere_index FROM authenticated';
      EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA lumiere_index FROM authenticated';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'lumiere_runtime') THEN
      EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON lumiere_index.index_entries, lumiere_index.discoveries, lumiere_index.tips TO lumiere_runtime';
      EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE lumiere_index.index_entries_id_seq, lumiere_index.discoveries_id_seq, lumiere_index.tips_id_seq TO lumiere_runtime';
    END IF;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "lumiere_index"."sections" s WHERE s."slug" IN ('discover','critique','personal')
    AND NOT EXISTS (SELECT 1 FROM "lumiere_index"."articles" a WHERE a."section_id" = s."id")
    AND NOT EXISTS (SELECT 1 FROM "lumiere_index"."_articles_v" v WHERE v."version_section_id" = s."id");
  ALTER TABLE "lumiere_index"."index_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lumiere_index"."discoveries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lumiere_index"."tips" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "lumiere_index"."index_entries" CASCADE;
  DROP TABLE "lumiere_index"."discoveries" CASCADE;
  DROP TABLE "lumiere_index"."tips" CASCADE;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_index_entries_fk";
  
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_discoveries_fk";
  
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_tips_fk";
  
  DROP INDEX IF EXISTS "lumiere_index"."payload_locked_documents_rels_index_entries_id_idx";
  DROP INDEX IF EXISTS "lumiere_index"."payload_locked_documents_rels_discoveries_id_idx";
  DROP INDEX IF EXISTS "lumiere_index"."payload_locked_documents_rels_tips_id_idx";
  ALTER TABLE "lumiere_index"."articles" DROP COLUMN "verdict";
  ALTER TABLE "lumiere_index"."_articles_v" DROP COLUMN "version_verdict";
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" DROP COLUMN "index_entries_id";
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" DROP COLUMN "discoveries_id";
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" DROP COLUMN "tips_id";
  DROP TYPE "lumiere_index"."enum_articles_verdict";
  DROP TYPE "lumiere_index"."enum__articles_v_version_verdict";
  DROP TYPE "lumiere_index"."enum_index_entries_category";
  DROP TYPE "lumiere_index"."enum_index_entries_movement";
  DROP TYPE "lumiere_index"."enum_tips_status";`)
}
