import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const addressSchema = z.object({
  street: z.string(),
  streetNumber: z.string(),
  city: z.string(),
  postCode: z.string(),
});

const geocodeSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const petOwners = pgTable('pet_owner', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  mobileNumber: text('mobile_number').notNull(),
  address: jsonb('address').$type<z.infer<typeof addressSchema>>(),
  geocode: jsonb('geocode').$type<z.infer<typeof geocodeSchema>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type PetOwner = typeof petOwners.$inferSelect;
export type NewPetOwner = typeof petOwners.$inferInsert;

export const insertPetOwnerSchema = createInsertSchema(petOwners);
export const selectPetOwnerSchema = createSelectSchema(petOwners);
