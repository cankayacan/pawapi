import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { caregivers } from '../src/db/schema/caregiver';
import {
  DogAge,
  DogSize,
  MobilityOption,
  PetTypePreference,
  ServiceType,
  Skill,
} from '../src/db/schema/caregiver';

// Load environment variables
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seedCaregiver() {
  try {
    console.log('🌱 Seeding sample caregiver...');

    const sampleCaregiver = {
      fullName: 'Sarah Johnson',
      photos: [
        'https://media.petstatic.com/host/a/1/a13b8cb1-cd3a-4d8a-83d6-711e6033e62a.jpg',
        'https://media.petstatic.com/host/8/3/83593300-2c77-4fd1-9456-6e9c179d8558.jpg',
      ],
      address: {
        street: 'Maple Street',
        number: '123',
        postCode: '10001',
        city: 'New York',
      },
      geocode: {
        lat: 40.7128,
        lng: -74.006,
      },
      services: [
        {
          type: ServiceType.DOG_WALKING,
          price: 25.0,
        },
        {
          type: ServiceType.PET_BOARDING,
          price: 45.0,
        },
        {
          type: ServiceType.HOUSE_SITTING,
          price: 60.0,
        },
      ],
      aboutTitle: 'Experienced Pet Care Professional',
      aboutDescription:
        'I am a passionate pet lover with over 5 years of experience caring for dogs, cats, and other pets. I specialize in providing personalized care and attention to each furry friend. I am certified in pet first aid and have experience with senior pets and special needs animals.',
      skills: [
        Skill.FIRST_AID,
        Skill.MEDICATION_ADMINISTRATION,
        Skill.SENIOR_CARE,
        Skill.BEHAVIORAL_TRAINING,
      ],
      availability: {
        Monday: ['09:00-12:00', '14:00-18:00'],
        Tuesday: ['09:00-12:00', '14:00-18:00'],
        Wednesday: ['09:00-12:00', '14:00-18:00'],
        Thursday: ['09:00-12:00', '14:00-18:00'],
        Friday: ['09:00-12:00', '14:00-18:00'],
        Saturday: ['10:00-16:00'],
        Sunday: ['10:00-16:00'],
      },
      unavailableDays: [
        '2025-12-25',
        '2025-12-26',
        '2026-01-01',
        '2025-11-28',
        '2025-08-10',
      ],
      petTypePreference: [PetTypePreference.DOG, PetTypePreference.CAT],
      dogSize: [DogSize.SMALL, DogSize.MEDIUM],
      dogAge: [DogAge.ADULT, DogAge.SENIOR],
      certifications: [
        'Pet First Aid & CPR Certified',
        'Professional Dog Trainer Certification',
        'Animal Behavior College Graduate',
      ],
      languages: ['English', 'Spanish'],
      mobility: [MobilityOption.CAR, MobilityOption.FOOT],
      averageRating: 4.8,
      totalReviews: 47,
    };

    const [insertedCaregiver] = await db
      .insert(caregivers)
      .values(sampleCaregiver)
      .returning();

    console.log('✅ Sample caregiver created successfully!');
    console.log('📋 Caregiver ID:', insertedCaregiver.id);
    console.log('👤 Name:', insertedCaregiver.fullName);
    console.log('⭐ Rating:', insertedCaregiver.averageRating);
    console.log(
      '📞 Services:',
      insertedCaregiver.services.length,
      'services offered',
    );
  } catch (error) {
    console.error('❌ Error seeding caregiver:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeding function
seedCaregiver();
