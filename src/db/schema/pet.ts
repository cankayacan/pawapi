import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { petOwners } from './pet-owner';

export const pets = pgTable('pet', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => petOwners.id),
  name: text('name').notNull(),
  chipNumber: text('chip_number'),
  type: text('type').notNull().default('DOG'),
  birthday: timestamp('birthday'),
  gender: text('gender').notNull().default('UNKNOWN'),
  sterilizationStatus: text('sterilization_status')
    .notNull()
    .default('UNKNOWN'),
  avatarFilePath: text('avatar_file_path'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type Pet = typeof pets.$inferSelect;
export type NewPet = typeof pets.$inferInsert;

export const insertPetSchema = createInsertSchema(pets);
export const selectPetSchema = createSelectSchema(pets);
