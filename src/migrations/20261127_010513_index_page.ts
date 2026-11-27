import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "lumiere_index"."index_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro" varchar NOT NULL,
  	"rules" varchar NOT NULL,
  	"week_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  ALTER TABLE lumiere_index.index_page ENABLE ROW LEVEL SECURITY;
  REVOKE ALL ON lumiere_index.index_page FROM PUBLIC;
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON lumiere_index.index_page FROM anon; END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON lumiere_index.index_page FROM authenticated; END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'lumiere_runtime') THEN
      GRANT SELECT, INSERT, UPDATE, DELETE ON lumiere_index.index_page TO lumiere_runtime;
      GRANT USAGE, SELECT ON SEQUENCE lumiere_index.index_page_id_seq TO lumiere_runtime;
    END IF;
  END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "lumiere_index"."index_page" CASCADE;`)
}
