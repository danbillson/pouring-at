CREATE TABLE "bar" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"address_line1" text,
	"address_line2" text,
	"city" text,
	"postcode" text,
	"formatted_address" text,
	"location" geometry(point),
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "bar_location_idx" ON "bar" USING gist ("location");