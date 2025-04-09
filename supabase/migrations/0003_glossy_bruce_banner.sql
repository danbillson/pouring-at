ALTER TABLE "bar" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "bar" ALTER COLUMN "updated_at" SET DEFAULT now();