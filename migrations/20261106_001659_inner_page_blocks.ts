import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_page_header_focus" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_category_details_division" AS ENUM('paper', 'stationery', 'services');
  CREATE TYPE "public"."enum_pages_blocks_category_details_display" AS ENUM('chips', 'cards');
  CREATE TYPE "public"."enum__pages_v_blocks_page_header_focus" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_category_details_division" AS ENUM('paper', 'stationery', 'services');
  CREATE TYPE "public"."enum__pages_v_blocks_category_details_display" AS ENUM('chips', 'cards');
  CREATE TABLE "pages_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_src" varchar,
  	"focus" "enum_pages_blocks_page_header_focus" DEFAULT 'center',
  	"primary_url" varchar,
  	"secondary_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_header_locales" (
  	"kicker" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"primary_label" varchar,
  	"secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_steps_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_places" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_hours" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_places_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_category_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"division" "enum_pages_blocks_category_details_division",
  	"display" "enum_pages_blocks_category_details_display" DEFAULT 'chips',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_details_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_companies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_companies_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_src" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_section_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"form_title" varchar,
  	"form_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_src" varchar,
  	"focus" "enum__pages_v_blocks_page_header_focus" DEFAULT 'center',
  	"primary_url" varchar,
  	"secondary_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_header_locales" (
  	"kicker" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"primary_label" varchar,
  	"secondary_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_places" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_hours" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_places_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_category_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"division" "enum__pages_v_blocks_category_details_division",
  	"display" "enum__pages_v_blocks_category_details_display" DEFAULT 'chips',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_details_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_companies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_companies_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_src" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_section_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"form_title" varchar,
  	"form_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_services_grid_items_locales" ADD COLUMN "points" varchar;
  ALTER TABLE "_pages_v_blocks_services_grid_items_locales" ADD COLUMN "points" varchar;
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header_locales" ADD CONSTRAINT "pages_blocks_page_header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items_locales" ADD CONSTRAINT "pages_blocks_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_locales" ADD CONSTRAINT "pages_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_items" ADD CONSTRAINT "pages_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_items_locales" ADD CONSTRAINT "pages_blocks_steps_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_locales" ADD CONSTRAINT "pages_blocks_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_places" ADD CONSTRAINT "pages_blocks_places_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_places_locales" ADD CONSTRAINT "pages_blocks_places_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_details" ADD CONSTRAINT "pages_blocks_category_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_details_locales" ADD CONSTRAINT "pages_blocks_category_details_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_companies" ADD CONSTRAINT "pages_blocks_companies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_companies_locales" ADD CONSTRAINT "pages_blocks_companies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section_locales" ADD CONSTRAINT "pages_blocks_contact_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header_locales" ADD CONSTRAINT "_pages_v_blocks_page_header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items_locales" ADD CONSTRAINT "_pages_v_blocks_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_locales" ADD CONSTRAINT "_pages_v_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_items" ADD CONSTRAINT "_pages_v_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_items_locales" ADD CONSTRAINT "_pages_v_blocks_steps_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_locales" ADD CONSTRAINT "_pages_v_blocks_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_places" ADD CONSTRAINT "_pages_v_blocks_places_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_places_locales" ADD CONSTRAINT "_pages_v_blocks_places_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_details" ADD CONSTRAINT "_pages_v_blocks_category_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_details_locales" ADD CONSTRAINT "_pages_v_blocks_category_details_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_companies" ADD CONSTRAINT "_pages_v_blocks_companies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_companies_locales" ADD CONSTRAINT "_pages_v_blocks_companies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_section" ADD CONSTRAINT "_pages_v_blocks_contact_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_section" ADD CONSTRAINT "_pages_v_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_section_locales" ADD CONSTRAINT "_pages_v_blocks_contact_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_section"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_page_header_order_idx" ON "pages_blocks_page_header" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_parent_id_idx" ON "pages_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_path_idx" ON "pages_blocks_page_header" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_image_idx" ON "pages_blocks_page_header" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_page_header_locales_locale_parent_id_unique" ON "pages_blocks_page_header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_page_header_locales_parent_id_idx" ON "pages_blocks_page_header_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_timeline_items_locales_locale_parent_id_unique" ON "pages_blocks_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_timeline_items_locales_parent_id_idx" ON "pages_blocks_timeline_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_timeline_locales_locale_parent_id_unique" ON "pages_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_timeline_locales_parent_id_idx" ON "pages_blocks_timeline_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_items_order_idx" ON "pages_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_items_parent_id_idx" ON "pages_blocks_steps_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_steps_items_locales_locale_parent_id_unique" ON "pages_blocks_steps_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_steps_items_locales_parent_id_idx" ON "pages_blocks_steps_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_steps_locales_locale_parent_id_unique" ON "pages_blocks_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_steps_locales_parent_id_idx" ON "pages_blocks_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_places_order_idx" ON "pages_blocks_places" USING btree ("_order");
  CREATE INDEX "pages_blocks_places_parent_id_idx" ON "pages_blocks_places" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_places_path_idx" ON "pages_blocks_places" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_places_locales_locale_parent_id_unique" ON "pages_blocks_places_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_places_locales_parent_id_idx" ON "pages_blocks_places_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_details_order_idx" ON "pages_blocks_category_details" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_details_parent_id_idx" ON "pages_blocks_category_details" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_details_path_idx" ON "pages_blocks_category_details" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_category_details_locales_locale_parent_id_uniqu" ON "pages_blocks_category_details_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_category_details_locales_parent_id_idx" ON "pages_blocks_category_details_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_companies_order_idx" ON "pages_blocks_companies" USING btree ("_order");
  CREATE INDEX "pages_blocks_companies_parent_id_idx" ON "pages_blocks_companies" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_companies_path_idx" ON "pages_blocks_companies" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_companies_locales_locale_parent_id_unique" ON "pages_blocks_companies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_companies_locales_parent_id_idx" ON "pages_blocks_companies_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_section_order_idx" ON "pages_blocks_contact_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_section_parent_id_idx" ON "pages_blocks_contact_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_section_path_idx" ON "pages_blocks_contact_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_section_image_idx" ON "pages_blocks_contact_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_contact_section_locales_locale_parent_id_unique" ON "pages_blocks_contact_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_contact_section_locales_parent_id_idx" ON "pages_blocks_contact_section_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_order_idx" ON "_pages_v_blocks_page_header" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_parent_id_idx" ON "_pages_v_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_path_idx" ON "_pages_v_blocks_page_header" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_image_idx" ON "_pages_v_blocks_page_header" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_header_locales_locale_parent_id_unique" ON "_pages_v_blocks_page_header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_locales_parent_id_idx" ON "_pages_v_blocks_page_header_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_order_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_items_parent_id_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_timeline_items_locales_locale_parent_id_uniq" ON "_pages_v_blocks_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_locales_parent_id_idx" ON "_pages_v_blocks_timeline_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_timeline_locales_locale_parent_id_unique" ON "_pages_v_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_locales_parent_id_idx" ON "_pages_v_blocks_timeline_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_items_order_idx" ON "_pages_v_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_items_parent_id_idx" ON "_pages_v_blocks_steps_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_steps_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_steps_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_items_locales_parent_id_idx" ON "_pages_v_blocks_steps_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_steps_locales_locale_parent_id_unique" ON "_pages_v_blocks_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_locales_parent_id_idx" ON "_pages_v_blocks_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_places_order_idx" ON "_pages_v_blocks_places" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_places_parent_id_idx" ON "_pages_v_blocks_places" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_places_path_idx" ON "_pages_v_blocks_places" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_places_locales_locale_parent_id_unique" ON "_pages_v_blocks_places_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_places_locales_parent_id_idx" ON "_pages_v_blocks_places_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_details_order_idx" ON "_pages_v_blocks_category_details" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_details_parent_id_idx" ON "_pages_v_blocks_category_details" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_details_path_idx" ON "_pages_v_blocks_category_details" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_details_locales_locale_parent_id_un" ON "_pages_v_blocks_category_details_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_category_details_locales_parent_id_idx" ON "_pages_v_blocks_category_details_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_companies_order_idx" ON "_pages_v_blocks_companies" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_companies_parent_id_idx" ON "_pages_v_blocks_companies" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_companies_path_idx" ON "_pages_v_blocks_companies" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_companies_locales_locale_parent_id_unique" ON "_pages_v_blocks_companies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_companies_locales_parent_id_idx" ON "_pages_v_blocks_companies_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_section_order_idx" ON "_pages_v_blocks_contact_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_section_parent_id_idx" ON "_pages_v_blocks_contact_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_section_path_idx" ON "_pages_v_blocks_contact_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_section_image_idx" ON "_pages_v_blocks_contact_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_section_locales_locale_parent_id_uni" ON "_pages_v_blocks_contact_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_section_locales_parent_id_idx" ON "_pages_v_blocks_contact_section_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_page_header" CASCADE;
  DROP TABLE "pages_blocks_page_header_locales" CASCADE;
  DROP TABLE "pages_blocks_timeline_items" CASCADE;
  DROP TABLE "pages_blocks_timeline_items_locales" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_timeline_locales" CASCADE;
  DROP TABLE "pages_blocks_steps_items" CASCADE;
  DROP TABLE "pages_blocks_steps_items_locales" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_places" CASCADE;
  DROP TABLE "pages_blocks_places_locales" CASCADE;
  DROP TABLE "pages_blocks_category_details" CASCADE;
  DROP TABLE "pages_blocks_category_details_locales" CASCADE;
  DROP TABLE "pages_blocks_companies" CASCADE;
  DROP TABLE "pages_blocks_companies_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_section" CASCADE;
  DROP TABLE "pages_blocks_contact_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_items" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_places" CASCADE;
  DROP TABLE "_pages_v_blocks_places_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_category_details" CASCADE;
  DROP TABLE "_pages_v_blocks_category_details_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_companies" CASCADE;
  DROP TABLE "_pages_v_blocks_companies_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_section" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_section_locales" CASCADE;
  ALTER TABLE "pages_blocks_services_grid_items_locales" DROP COLUMN "points";
  ALTER TABLE "_pages_v_blocks_services_grid_items_locales" DROP COLUMN "points";
  DROP TYPE "public"."enum_pages_blocks_page_header_focus";
  DROP TYPE "public"."enum_pages_blocks_category_details_division";
  DROP TYPE "public"."enum_pages_blocks_category_details_display";
  DROP TYPE "public"."enum__pages_v_blocks_page_header_focus";
  DROP TYPE "public"."enum__pages_v_blocks_category_details_division";
  DROP TYPE "public"."enum__pages_v_blocks_category_details_display";`)
}
