import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "elan"."enum_subscribers_status" AS ENUM('active', 'unsubscribed');
  CREATE TYPE "elan"."enum_subscribers_welcome_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TABLE "elan"."subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"status" "elan"."enum_subscribers_status" DEFAULT 'active' NOT NULL,
  	"subscription_id" varchar NOT NULL,
  	"subscribed_at" timestamp(3) with time zone NOT NULL,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"welcome_status" "elan"."enum_subscribers_welcome_status" DEFAULT 'pending' NOT NULL,
  	"welcome_attempted_at" timestamp(3) with time zone,
  	"welcome_message_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "elan"."newsletter_rate_limits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"window_start" timestamp(3) with time zone NOT NULL,
  	"attempts" numeric DEFAULT 1 NOT NULL
  );

  ALTER TABLE "elan"."subscribers" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "elan"."newsletter_rate_limits" ENABLE ROW LEVEL SECURITY;
  REVOKE ALL ON TABLE "elan"."subscribers", "elan"."newsletter_rate_limits" FROM PUBLIC;
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON TABLE "elan"."subscribers", "elan"."newsletter_rate_limits" FROM anon; END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON TABLE "elan"."subscribers", "elan"."newsletter_rate_limits" FROM authenticated; END IF;
  END $$;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD COLUMN "subscribers_id" integer;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD COLUMN "newsletter_rate_limits_id" integer;
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "elan"."subscribers" USING btree ("email");
  CREATE INDEX "subscribers_status_idx" ON "elan"."subscribers" USING btree ("status");
  CREATE INDEX "subscribers_updated_at_idx" ON "elan"."subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "elan"."subscribers" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_rate_limits_key_idx" ON "elan"."newsletter_rate_limits" USING btree ("key");
  CREATE INDEX "newsletter_rate_limits_window_start_idx" ON "elan"."newsletter_rate_limits" USING btree ("window_start");
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "elan"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elan"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_rate_limits_fk" FOREIGN KEY ("newsletter_rate_limits_id") REFERENCES "elan"."newsletter_rate_limits"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "elan"."payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_rate_limits_id_idx" ON "elan"."payload_locked_documents_rels" USING btree ("newsletter_rate_limits_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM "elan"."subscribers") THEN RAISE EXCEPTION 'Refusing to drop subscriber records. Export and remove them before rollback.'; END IF;
    END $$;
    ALTER TABLE "elan"."payload_locked_documents_rels" DROP COLUMN "subscribers_id";
    ALTER TABLE "elan"."payload_locked_documents_rels" DROP COLUMN "newsletter_rate_limits_id";
    DROP TABLE "elan"."subscribers";
    DROP TABLE "elan"."newsletter_rate_limits";
    DROP TYPE "elan"."enum_subscribers_status";
    DROP TYPE "elan"."enum_subscribers_welcome_status";
  `)
}
