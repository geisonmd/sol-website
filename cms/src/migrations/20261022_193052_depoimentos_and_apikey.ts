import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "depoimentos" ADD COLUMN "city_id" integer NOT NULL;
  ALTER TABLE "depoimentos" ADD COLUMN "years_as_client" numeric;
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "depoimentos" ADD CONSTRAINT "depoimentos_city_id_ciudades_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."ciudades"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "depoimentos_city_idx" ON "depoimentos" USING btree ("city_id");
  ALTER TABLE "depoimentos" DROP COLUMN "city";
  ALTER TABLE "depoimentos" DROP COLUMN "company_area";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "depoimentos" DROP CONSTRAINT "depoimentos_city_id_ciudades_id_fk";
  
  DROP INDEX "depoimentos_city_idx";
  ALTER TABLE "depoimentos" ADD COLUMN "city" varchar NOT NULL;
  ALTER TABLE "depoimentos" ADD COLUMN "company_area" varchar;
  ALTER TABLE "depoimentos" DROP COLUMN "city_id";
  ALTER TABLE "depoimentos" DROP COLUMN "years_as_client";
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN "api_key";
  ALTER TABLE "users" DROP COLUMN "api_key_index";`)
}
