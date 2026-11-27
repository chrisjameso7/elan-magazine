import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "lumiere_index"."enum_applications_beats" AS ENUM('music', 'film-tv', 'internet', 'style', 'books', 'art', 'sport', 'gaming', 'culture');
  CREATE TYPE "lumiere_index"."enum_applications_formats" AS ENUM('discover', 'critique', 'personal');
  CREATE TYPE "lumiere_index"."enum_applications_status" AS ENUM('new', 'reviewing', 'accepted', 'declined');
  CREATE TABLE "lumiere_index"."applications_beats" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "lumiere_index"."enum_applications_beats",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."applications_formats" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "lumiere_index"."enum_applications_formats",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "lumiere_index"."applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"location" varchar,
  	"pitch" varchar NOT NULL,
  	"why_them" varchar,
  	"samples" varchar,
  	"social" varchar,
  	"status" "lumiere_index"."enum_applications_status" DEFAULT 'new' NOT NULL,
  	"editor_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD COLUMN "applications_id" integer;
  ALTER TABLE "lumiere_index"."applications_beats" ADD CONSTRAINT "applications_beats_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "lumiere_index"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lumiere_index"."applications_formats" ADD CONSTRAINT "applications_formats_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "lumiere_index"."applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "applications_beats_order_idx" ON "lumiere_index"."applications_beats" USING btree ("order");
  CREATE INDEX "applications_beats_parent_idx" ON "lumiere_index"."applications_beats" USING btree ("parent_id");
  CREATE INDEX "applications_formats_order_idx" ON "lumiere_index"."applications_formats" USING btree ("order");
  CREATE INDEX "applications_formats_parent_idx" ON "lumiere_index"."applications_formats" USING btree ("parent_id");
  CREATE INDEX "applications_updated_at_idx" ON "lumiere_index"."applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "lumiere_index"."applications" USING btree ("created_at");
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "lumiere_index"."applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "lumiere_index"."payload_locked_documents_rels" USING btree ("applications_id");
  DO $$ DECLARE target record; BEGIN
    FOR target IN SELECT tablename FROM pg_tables WHERE schemaname = 'lumiere_index' AND tablename LIKE 'applications%' LOOP
      EXECUTE format('ALTER TABLE lumiere_index.%I ENABLE ROW LEVEL SECURITY', target.tablename);
      EXECUTE format('REVOKE ALL ON lumiere_index.%I FROM PUBLIC', target.tablename);
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        EXECUTE format('REVOKE ALL ON lumiere_index.%I FROM anon', target.tablename);
      END IF;
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        EXECUTE format('REVOKE ALL ON lumiere_index.%I FROM authenticated', target.tablename);
      END IF;
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'lumiere_runtime') THEN
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON lumiere_index.%I TO lumiere_runtime', target.tablename);
      END IF;
    END LOOP;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'lumiere_runtime') THEN
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA lumiere_index TO lumiere_runtime;
    END IF;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lumiere_index"."applications_beats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lumiere_index"."applications_formats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lumiere_index"."applications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "lumiere_index"."applications_beats" CASCADE;
  DROP TABLE "lumiere_index"."applications_formats" CASCADE;
  DROP TABLE "lumiere_index"."applications" CASCADE;
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_applications_fk";
  
  DROP INDEX IF EXISTS "lumiere_index"."payload_locked_documents_rels_applications_id_idx";
  ALTER TABLE "lumiere_index"."payload_locked_documents_rels" DROP COLUMN "applications_id";
  DROP TYPE "lumiere_index"."enum_applications_beats";
  DROP TYPE "lumiere_index"."enum_applications_formats";
  DROP TYPE "lumiere_index"."enum_applications_status";`)
}
