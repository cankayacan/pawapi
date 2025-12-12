import { registerEnumType } from '@nestjs/graphql';

import {
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Service Type enum
export const ServiceType = {
  PET_BOARDING: 'PET_BOARDING',
  HOUSE_SITTING: 'HOUSE_SITTING',
  DOG_WALKING: 'DOG_WALKING',
  PET_GROOMING: 'PET_GROOMING',
  HOUSE_VISITING: 'HOUSE_VISITING',
} as const;

// Skill enum
export const Skill = {
  // 🩺 Medical & Special Needs
  MEDICATION_ADMINISTRATION: 'MEDICATION_ADMINISTRATION',
  INJECTION_ADMINISTRATION: 'INJECTION_ADMINISTRATION',
  FIRST_AID: 'FIRST_AID',
  SENIOR_CARE: 'SENIOR_CARE',
  SPECIAL_NEEDS_CARE: 'SPECIAL_NEEDS_CARE',
  POST_SURGERY_CARE: 'POST_SURGERY_CARE',

  // 🐕 Training & Behavior
  BASIC_OBEDIENCE_TRAINING: 'BASIC_OBEDIENCE_TRAINING',
  BEHAVIORAL_TRAINING: 'BEHAVIORAL_TRAINING',
  PUPPY_TRAINING: 'PUPPY_TRAINING',
  POSITIVE_REINFORCEMENT: 'POSITIVE_REINFORCEMENT',

  // 🧼 Grooming & Hygiene
  BATHING_AND_BRUSHING: 'BATHING_AND_BRUSHING',
  NAIL_TRIMMING: 'NAIL_TRIMMING',
  EAR_CLEANING: 'EAR_CLEANING',
  COAT_TRIMMING: 'COAT_TRIMMING',

  // 🧠 General Handling
  MULTIPLE_PETS_HANDLING: 'MULTIPLE_PETS_HANDLING',
  CALMING_ANXIOUS_PETS: 'CALMING_ANXIOUS_PETS',
  ACTIVE_PLAY: 'ACTIVE_PLAY',

  // 🐾 Other Pet Types
  EXOTIC_PET_EXPERIENCE: 'EXOTIC_PET_EXPERIENCE',
} as const;

// Dog Size enum
export const DogSize = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
  XLARGE: 'XLARGE',
} as const;

// Pet Type Preference enum
export const PetTypePreference = {
  CAT: 'CAT',
  DOG: 'DOG',
  SMALL_MAMMALS: 'SMALL_MAMMALS',
  BIRDS: 'BIRDS',
} as const;

// Dog Age enum
export const DogAge = {
  PUPPY: 'PUPPY',
  ADULT: 'ADULT',
  SENIOR: 'SENIOR',
} as const;

// Mobility Option enum
export const MobilityOption = {
  CAR: 'CAR',
  BIKE: 'BIKE',
  FOOT: 'FOOT',
  PUBLIC_TRANSPORT: 'PUBLIC_TRANSPORT',
} as const;

// Zod schemas for complex types
const addressSchema = z.object({
  street: z.string(),
  number: z.string(),
  postCode: z.string(),
  city: z.string(),
});

const geocodeSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const serviceSchema = z.object({
  type: z.enum(Object.values(ServiceType) as [string, ...string[]]),
  price: z.number(),
});

const availabilitySchema = z.object({
  Monday: z.array(z.string()).optional(),
  Tuesday: z.array(z.string()).optional(),
  Wednesday: z.array(z.string()).optional(),
  Thursday: z.array(z.string()).optional(),
  Friday: z.array(z.string()).optional(),
  Saturday: z.array(z.string()).optional(),
  Sunday: z.array(z.string()).optional(),
});

const unavailableDaysSchema = z.array(z.string()); // Array of ISO date strings

// Main caregivers table
export const caregivers = pgTable('caregiver', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  photos: text('photos').array().notNull().default([]),

  // Address and location
  address: jsonb('address').$type<z.infer<typeof addressSchema>>().notNull(),
  geocode: jsonb('geocode').$type<z.infer<typeof geocodeSchema>>().notNull(),

  // Services offered
  services: jsonb('services')
    .$type<z.infer<typeof serviceSchema>[]>()
    .notNull()
    .default([]),

  // About section
  aboutTitle: text('about_title').notNull(),
  aboutDescription: text('about_description').notNull(),

  // Skills and preferences
  skills: text('skills').array().notNull().default([]),
  availability: jsonb('availability')
    .$type<z.infer<typeof availabilitySchema>>()
    .notNull()
    .default({}),
  unavailableDays: jsonb('unavailable_days')
    .$type<z.infer<typeof unavailableDaysSchema>>()
    .notNull()
    .default([]),

  // Pet preferences
  petTypePreference: text('pet_type_preference').array().notNull().default([]),
  dogSize: text('dog_size').array().notNull().default([]),
  dogAge: text('dog_age').array().notNull().default([]),

  // Additional information
  certifications: text('certifications').array().notNull().default([]),
  languages: text('languages').array().notNull().default([]),
  mobility: text('mobility').array().notNull().default([]),

  // Ratings
  averageRating: real('average_rating').notNull().default(0),
  totalReviews: integer('total_reviews').notNull().default(0),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Schema for inserting a caregiver
export const insertCaregiverSchema = createInsertSchema(caregivers);

// Schema for selecting a caregiver
export const selectCaregiverSchema = createSelectSchema(caregivers);

// Types
export type Caregiver = z.infer<typeof selectCaregiverSchema>;
export type NewCaregiver = z.infer<typeof insertCaregiverSchema>;

// Additional type exports for use in other parts of the application
export type ServiceType = (typeof ServiceType)[keyof typeof ServiceType];
export type Skill = (typeof Skill)[keyof typeof Skill];
export type DogSize = (typeof DogSize)[keyof typeof DogSize];
export type PetTypePreference =
  (typeof PetTypePreference)[keyof typeof PetTypePreference];
export type DogAge = (typeof DogAge)[keyof typeof DogAge];
export type MobilityOption =
  (typeof MobilityOption)[keyof typeof MobilityOption];
export type Address = z.infer<typeof addressSchema>;
export type Geocode = z.infer<typeof geocodeSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type UnavailableDays = z.infer<typeof unavailableDaysSchema>;

// Register enums with GraphQL
registerEnumType(ServiceType, {
  name: 'ServiceType',
  description: 'Types of services offered by caregivers',
});

registerEnumType(Skill, {
  name: 'Skill',
  description: 'Skills possessed by caregivers',
});

registerEnumType(DogSize, {
  name: 'DogSize',
  description: 'Size categories for dogs',
});

registerEnumType(PetTypePreference, {
  name: 'PetTypePreference',
  description: 'Pet type preferences for caregivers',
});

registerEnumType(DogAge, {
  name: 'DogAge',
  description: 'Dog age categories',
});

registerEnumType(MobilityOption, {
  name: 'MobilityOption',
  description: 'Mobility options available to caregivers',
});
