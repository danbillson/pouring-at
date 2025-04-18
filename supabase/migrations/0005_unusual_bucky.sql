CREATE TABLE "beer" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brewery_id" text NOT NULL,
	"abv" numeric(3, 1),
	"style" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brewery" (
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brewery_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tap" (
	"id" text PRIMARY KEY NOT NULL,
	"bar_id" text NOT NULL,
	"beer_id" text NOT NULL,
	"tapped_on" timestamp DEFAULT now() NOT NULL,
	"tapped_off" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tap_bar_beer_unique" UNIQUE("bar_id","beer_id")
);
--> statement-breakpoint
ALTER TABLE "beer" ADD CONSTRAINT "beer_brewery_id_brewery_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."brewery"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tap" ADD CONSTRAINT "tap_bar_id_bar_id_fk" FOREIGN KEY ("bar_id") REFERENCES "public"."bar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tap" ADD CONSTRAINT "tap_beer_id_beer_id_fk" FOREIGN KEY ("beer_id") REFERENCES "public"."beer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "brewery_location_idx" ON "brewery" USING gist ("location");