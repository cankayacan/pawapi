CREATE TABLE "appointment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_owner_id" uuid NOT NULL,
	"pet_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"reason" text NOT NULL,
	"other_reason" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"failure_reason" text,
	"other_failure_reason" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"mobile_number" text NOT NULL,
	"roles" text[] DEFAULT '{"PET_OWNER"}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "pet_owner" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"mobile_number" text NOT NULL,
	"address" jsonb,
	"geocode" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "pet_owner_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "pet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"chip_number" text,
	"type" text DEFAULT 'DOG' NOT NULL,
	"birthday" timestamp,
	"gender" text DEFAULT 'UNKNOWN' NOT NULL,
	"sterilization_status" text DEFAULT 'UNKNOWN' NOT NULL,
	"avatar_file_path" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_pet_owner_id_pet_owner_id_fk" FOREIGN KEY ("pet_owner_id") REFERENCES "public"."pet_owner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_owner_id_pet_owner_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."pet_owner"("id") ON DELETE no action ON UPDATE no action;