import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { Role } from '../../auth/types/role';

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  mobileNumber: text('mobile_number').notNull(),
  roles: text('roles').array().notNull().default([Role.PET_OWNER]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Schema for inserting a user
export const insertUserSchema = createInsertSchema(users);

// Schema for selecting a user
export const selectUserSchema = createSelectSchema(users);

// Types
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
