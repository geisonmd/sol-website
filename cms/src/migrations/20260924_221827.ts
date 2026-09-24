import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "sucursales" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"image_id" integer,
  	"city_id" integer,
  	"business_hours" varchar,
  	"google_maps_url" varchar,
  	"coordinates_lat" numeric,
  	"coordinates_lng" numeric,
  	"manager_contact_link" varchar,
  	"service_coordinator_phone" varchar,
  	"call_center_phone" varchar DEFAULT '*10000',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sucursales_id" integer;
  ALTER TABLE "sucursales" ADD CONSTRAINT "sucursales_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sucursales" ADD CONSTRAINT "sucursales_city_id_ciudades_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."ciudades"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "sucursales_slug_idx" ON "sucursales" USING btree ("slug");
  CREATE INDEX "sucursales_image_idx" ON "sucursales" USING btree ("image_id");
  CREATE INDEX "sucursales_city_idx" ON "sucursales" USING btree ("city_id");
  CREATE INDEX "sucursales_updated_at_idx" ON "sucursales" USING btree ("updated_at");
  CREATE INDEX "sucursales_created_at_idx" ON "sucursales" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sucursales_fk" FOREIGN KEY ("sucursales_id") REFERENCES "public"."sucursales"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_sucursales_id_idx" ON "payload_locked_documents_rels" USING btree ("sucursales_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sucursales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sucursales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sucursales_fk";
  
  DROP INDEX "payload_locked_documents_rels_sucursales_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sucursales_id";`)
}
