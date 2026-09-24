import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_planes_ideal_for" AS ENUM('casa', 'empresa');
  CREATE TYPE "public"."enum_planes_tipo" AS ENUM('fibra', 'xtreme');
  CREATE TYPE "public"."enum_planes_categoria_fibra" AS ENUM('go-home', 'business', 'cooperativo', 'enterprise');
  CREATE TABLE "planes_ideal_for" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_planes_ideal_for",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "planes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"tipo" "enum_planes_tipo" NOT NULL,
  	"categoria_fibra" "enum_planes_categoria_fibra",
  	"download" numeric NOT NULL,
  	"upload" numeric NOT NULL,
  	"price_u_s_d" numeric NOT NULL,
  	"price_gs" numeric,
  	"wifi_access_points" numeric DEFAULT 0,
  	"first_month_free" boolean DEFAULT false,
  	"ports" varchar,
  	"zona_urbana" boolean DEFAULT true,
  	"zona_rural" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "planes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ciudades_id" integer
  );
  
  CREATE TABLE "departamentos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ciudades" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"departamento_id" integer NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "planes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "departamentos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ciudades_id" integer;
  ALTER TABLE "planes_ideal_for" ADD CONSTRAINT "planes_ideal_for_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."planes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "planes_rels" ADD CONSTRAINT "planes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."planes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "planes_rels" ADD CONSTRAINT "planes_rels_ciudades_fk" FOREIGN KEY ("ciudades_id") REFERENCES "public"."ciudades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ciudades" ADD CONSTRAINT "ciudades_departamento_id_departamentos_id_fk" FOREIGN KEY ("departamento_id") REFERENCES "public"."departamentos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "planes_ideal_for_order_idx" ON "planes_ideal_for" USING btree ("order");
  CREATE INDEX "planes_ideal_for_parent_idx" ON "planes_ideal_for" USING btree ("parent_id");
  CREATE UNIQUE INDEX "planes_slug_idx" ON "planes" USING btree ("slug");
  CREATE INDEX "planes_updated_at_idx" ON "planes" USING btree ("updated_at");
  CREATE INDEX "planes_created_at_idx" ON "planes" USING btree ("created_at");
  CREATE INDEX "planes_rels_order_idx" ON "planes_rels" USING btree ("order");
  CREATE INDEX "planes_rels_parent_idx" ON "planes_rels" USING btree ("parent_id");
  CREATE INDEX "planes_rels_path_idx" ON "planes_rels" USING btree ("path");
  CREATE INDEX "planes_rels_ciudades_id_idx" ON "planes_rels" USING btree ("ciudades_id");
  CREATE UNIQUE INDEX "departamentos_name_idx" ON "departamentos" USING btree ("name");
  CREATE UNIQUE INDEX "departamentos_slug_idx" ON "departamentos" USING btree ("slug");
  CREATE INDEX "departamentos_updated_at_idx" ON "departamentos" USING btree ("updated_at");
  CREATE INDEX "departamentos_created_at_idx" ON "departamentos" USING btree ("created_at");
  CREATE INDEX "ciudades_departamento_idx" ON "ciudades" USING btree ("departamento_id");
  CREATE UNIQUE INDEX "ciudades_slug_idx" ON "ciudades" USING btree ("slug");
  CREATE INDEX "ciudades_updated_at_idx" ON "ciudades" USING btree ("updated_at");
  CREATE INDEX "ciudades_created_at_idx" ON "ciudades" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_planes_fk" FOREIGN KEY ("planes_id") REFERENCES "public"."planes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departamentos_fk" FOREIGN KEY ("departamentos_id") REFERENCES "public"."departamentos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ciudades_fk" FOREIGN KEY ("ciudades_id") REFERENCES "public"."ciudades"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_planes_id_idx" ON "payload_locked_documents_rels" USING btree ("planes_id");
  CREATE INDEX "payload_locked_documents_rels_departamentos_id_idx" ON "payload_locked_documents_rels" USING btree ("departamentos_id");
  CREATE INDEX "payload_locked_documents_rels_ciudades_id_idx" ON "payload_locked_documents_rels" USING btree ("ciudades_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "planes_ideal_for" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "planes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "planes_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "departamentos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ciudades" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "planes_ideal_for" CASCADE;
  DROP TABLE "planes" CASCADE;
  DROP TABLE "planes_rels" CASCADE;
  DROP TABLE "departamentos" CASCADE;
  DROP TABLE "ciudades" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_planes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_departamentos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ciudades_fk";
  
  DROP INDEX "payload_locked_documents_rels_planes_id_idx";
  DROP INDEX "payload_locked_documents_rels_departamentos_id_idx";
  DROP INDEX "payload_locked_documents_rels_ciudades_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "planes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "departamentos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ciudades_id";
  DROP TYPE "public"."enum_planes_ideal_for";
  DROP TYPE "public"."enum_planes_tipo";
  DROP TYPE "public"."enum_planes_categoria_fibra";`)
}
