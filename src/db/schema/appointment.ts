import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { AppointmentStatus } from '../../appointment/types/appointment-status';
import { pets } from './pet';
import { petOwners } from './pet-owner';

export const appointments = pgTable('appointment', {
  id: uuid('id').primaryKey().defaultRandom(),
  petOwnerId: uuid('pet_owner_id')
    .notNull()
    .references(() => petOwners.id),
  petId: uuid('pet_id')
    .notNull()
    .references(() => pets.id),
  date: timestamp('date').notNull(),
  reason: text('reason').notNull(),
  otherReason: text('other_reason'),
  status: text('status').notNull().default(AppointmentStatus.PENDING),
  failureReason: text('failure_reason'),
  otherFailureReason: text('other_failure_reason'),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Schema for inserting an appointment
export const insertAppointmentSchema = createInsertSchema(appointments, {
  date: z.string().transform((str) => new Date(str)),
});

// Schema for selecting an appointment
export const selectAppointmentSchema = createSelectSchema(appointments);

// Types
export type Appointment = z.infer<typeof selectAppointmentSchema>;
export type NewAppointment = z.infer<typeof insertAppointmentSchema>;
