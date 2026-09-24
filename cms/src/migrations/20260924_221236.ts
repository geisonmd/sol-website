import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vacantes_work_mode" AS ENUM('presencial', 'remoto', 'hibrido');
  CREATE TYPE "public"."enum_vacantes_employment_type" AS ENUM('efectivo', 'temporal', 'pasantia', 'freelance');
  CREATE TYPE "public"."enum_vacantes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__vacantes_v_version_work_mode" AS ENUM('presencial', 'remoto', 'hibrido');
  CREATE TYPE "public"."enum__vacantes_v_version_employment_type" AS ENUM('efectivo', 'temporal', 'pasantia', 'freelance');
  CREATE TYPE "public"."enum__vacantes_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "vacantes_hiring_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "vacantes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"featured_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"application_deadline" timestamp(3) with time zone,
  	"is_open" boolean DEFAULT true,
  	"city_id" integer,
  	"work_mode" "enum_vacantes_work_mode",
  	"employment_type" "enum_vacantes_employment_type",
  	"pcd_friendly" boolean DEFAULT false,
  	"description_enabled" boolean DEFAULT true,
  	"description_content" jsonb,
  	"responsibilities_enabled" boolean DEFAULT true,
  	"responsibilities_content" jsonb,
  	"requirements_enabled" boolean DEFAULT true,
  	"requirements_content" jsonb,
  	"additional_info_enabled" boolean DEFAULT true,
  	"additional_info_content" jsonb,
  	"hiring_process_enabled" boolean DEFAULT true,
  	"show_company_info" boolean DEFAULT true,
  	"show_real_time_c_t_a" boolean DEFAULT true,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_vacantes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_vacantes_v_version_hiring_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vacantes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_featured_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_application_deadline" timestamp(3) with time zone,
  	"version_is_open" boolean DEFAULT true,
  	"version_city_id" integer,
  	"version_work_mode" "enum__vacantes_v_version_work_mode",
  	"version_employment_type" "enum__vacantes_v_version_employment_type",
  	"version_pcd_friendly" boolean DEFAULT false,
  	"version_description_enabled" boolean DEFAULT true,
  	"version_description_content" jsonb,
  	"version_responsibilities_enabled" boolean DEFAULT true,
  	"version_responsibilities_content" jsonb,
  	"version_requirements_enabled" boolean DEFAULT true,
  	"version_requirements_content" jsonb,
  	"version_additional_info_enabled" boolean DEFAULT true,
  	"version_additional_info_content" jsonb,
  	"version_hiring_process_enabled" boolean DEFAULT true,
  	"version_show_company_info" boolean DEFAULT true,
  	"version_show_real_time_c_t_a" boolean DEFAULT true,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__vacantes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "depoimentos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"company_area" varchar,
  	"comment" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vacantes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "depoimentos_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "company_blurb" jsonb;
  ALTER TABLE "vacantes_hiring_process_steps" ADD CONSTRAINT "vacantes_hiring_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacantes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacantes" ADD CONSTRAINT "vacantes_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacantes" ADD CONSTRAINT "vacantes_city_id_ciudades_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."ciudades"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacantes" ADD CONSTRAINT "vacantes_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacantes_v_version_hiring_process_steps" ADD CONSTRAINT "_vacantes_v_version_hiring_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vacantes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vacantes_v" ADD CONSTRAINT "_vacantes_v_parent_id_vacantes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vacantes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacantes_v" ADD CONSTRAINT "_vacantes_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacantes_v" ADD CONSTRAINT "_vacantes_v_version_city_id_ciudades_id_fk" FOREIGN KEY ("version_city_id") REFERENCES "public"."ciudades"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacantes_v" ADD CONSTRAINT "_vacantes_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "depoimentos" ADD CONSTRAINT "depoimentos_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "vacantes_hiring_process_steps_order_idx" ON "vacantes_hiring_process_steps" USING btree ("_order");
  CREATE INDEX "vacantes_hiring_process_steps_parent_id_idx" ON "vacantes_hiring_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vacantes_slug_idx" ON "vacantes" USING btree ("slug");
  CREATE INDEX "vacantes_featured_image_idx" ON "vacantes" USING btree ("featured_image_id");
  CREATE INDEX "vacantes_city_idx" ON "vacantes" USING btree ("city_id");
  CREATE INDEX "vacantes_meta_meta_image_idx" ON "vacantes" USING btree ("meta_image_id");
  CREATE INDEX "vacantes_updated_at_idx" ON "vacantes" USING btree ("updated_at");
  CREATE INDEX "vacantes_created_at_idx" ON "vacantes" USING btree ("created_at");
  CREATE INDEX "vacantes__status_idx" ON "vacantes" USING btree ("_status");
  CREATE INDEX "_vacantes_v_version_hiring_process_steps_order_idx" ON "_vacantes_v_version_hiring_process_steps" USING btree ("_order");
  CREATE INDEX "_vacantes_v_version_hiring_process_steps_parent_id_idx" ON "_vacantes_v_version_hiring_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_vacantes_v_parent_idx" ON "_vacantes_v" USING btree ("parent_id");
  CREATE INDEX "_vacantes_v_version_version_slug_idx" ON "_vacantes_v" USING btree ("version_slug");
  CREATE INDEX "_vacantes_v_version_version_featured_image_idx" ON "_vacantes_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_vacantes_v_version_version_city_idx" ON "_vacantes_v" USING btree ("version_city_id");
  CREATE INDEX "_vacantes_v_version_meta_version_meta_image_idx" ON "_vacantes_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_vacantes_v_version_version_updated_at_idx" ON "_vacantes_v" USING btree ("version_updated_at");
  CREATE INDEX "_vacantes_v_version_version_created_at_idx" ON "_vacantes_v" USING btree ("version_created_at");
  CREATE INDEX "_vacantes_v_version_version__status_idx" ON "_vacantes_v" USING btree ("version__status");
  CREATE INDEX "_vacantes_v_created_at_idx" ON "_vacantes_v" USING btree ("created_at");
  CREATE INDEX "_vacantes_v_updated_at_idx" ON "_vacantes_v" USING btree ("updated_at");
  CREATE INDEX "_vacantes_v_latest_idx" ON "_vacantes_v" USING btree ("latest");
  CREATE INDEX "depoimentos_photo_idx" ON "depoimentos" USING btree ("photo_id");
  CREATE INDEX "depoimentos_updated_at_idx" ON "depoimentos" USING btree ("updated_at");
  CREATE INDEX "depoimentos_created_at_idx" ON "depoimentos" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacantes_fk" FOREIGN KEY ("vacantes_id") REFERENCES "public"."vacantes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_depoimentos_fk" FOREIGN KEY ("depoimentos_id") REFERENCES "public"."depoimentos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_vacantes_id_idx" ON "payload_locked_documents_rels" USING btree ("vacantes_id");
  CREATE INDEX "payload_locked_documents_rels_depoimentos_id_idx" ON "payload_locked_documents_rels" USING btree ("depoimentos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vacantes_hiring_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vacantes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_vacantes_v_version_hiring_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_vacantes_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "depoimentos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "vacantes_hiring_process_steps" CASCADE;
  DROP TABLE "vacantes" CASCADE;
  DROP TABLE "_vacantes_v_version_hiring_process_steps" CASCADE;
  DROP TABLE "_vacantes_v" CASCADE;
  DROP TABLE "depoimentos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vacantes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_depoimentos_fk";
  
  DROP INDEX "payload_locked_documents_rels_vacantes_id_idx";
  DROP INDEX "payload_locked_documents_rels_depoimentos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vacantes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "depoimentos_id";
  ALTER TABLE "site_settings" DROP COLUMN "company_blurb";
  DROP TYPE "public"."enum_vacantes_work_mode";
  DROP TYPE "public"."enum_vacantes_employment_type";
  DROP TYPE "public"."enum_vacantes_status";
  DROP TYPE "public"."enum__vacantes_v_version_work_mode";
  DROP TYPE "public"."enum__vacantes_v_version_employment_type";
  DROP TYPE "public"."enum__vacantes_v_version_status";`)
}
