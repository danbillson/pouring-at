ALTER TABLE "brewery" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "brewery" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "brewery" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "brewery" ADD CONSTRAINT "brewery_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;