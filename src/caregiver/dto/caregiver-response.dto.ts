import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import {
  Caregiver,
  DogAge,
  DogSize,
  PetTypePreference,
} from '../../db/schema/caregiver';
import { CaregiverAddressResponseDto } from './address-response.dto';
import { DayAvailabilityDto } from './availability-response.dto';
import { CaregiverGeocodeResponseDto } from './geocode-response.dto';
import { CaregiverServiceResponseDto } from './service-response.dto';

@ObjectType()
export class CaregiverResponseDto {
  @Field(() => ID, { description: 'Id of the caregiver' })
  id: string;

  @Field({ description: 'Full name of the caregiver' })
  fullName: string;

  @Field(() => [String], { description: 'Photos of the caregiver' })
  photos: string[];

  @Field(() => CaregiverAddressResponseDto, {
    description: 'Address of the caregiver',
  })
  address: CaregiverAddressResponseDto;

  @Field(() => CaregiverGeocodeResponseDto, {
    description: 'Geocode of the caregiver',
  })
  geocode: CaregiverGeocodeResponseDto;

  @Field(() => [CaregiverServiceResponseDto], {
    description: 'Services offered by the caregiver',
  })
  services: CaregiverServiceResponseDto[];

  @Field({ description: 'About title of the caregiver' })
  aboutTitle: string;

  @Field({ description: 'About description of the caregiver' })
  aboutDescription: string;

  @Field(() => [String], { description: 'Skills of the caregiver' })
  skills: string[];

  @Field(() => DayAvailabilityDto, {
    description: 'Availability schedule of the caregiver',
  })
  availability: DayAvailabilityDto;

  @Field(() => [String], {
    description: 'Unavailable dates of the caregiver (ISO date strings)',
  })
  unavailableDays: string[];

  @Field(() => [PetTypePreference], {
    description: 'Pet type preferences of the caregiver',
  })
  petTypePreference: PetTypePreference[];

  @Field(() => [DogAge], {
    description: 'Dog age preferences of the caregiver',
  })
  dogAge: DogAge[];

  @Field(() => [DogSize], {
    description: 'Dog size preferences of the caregiver',
  })
  dogSize: DogSize[];

  @Field(() => [String], { description: 'Certifications of the caregiver' })
  certifications: string[];

  @Field(() => [String], { description: 'Languages spoken by the caregiver' })
  languages: string[];

  @Field(() => [String], { description: 'Mobility options of the caregiver' })
  mobility: string[];

  @Field(() => Float, { description: 'Average rating of the caregiver' })
  averageRating: number;

  @Field(() => Int, { description: 'Total number of reviews' })
  totalReviews: number;

  static fromCaregiver(caregiver: Caregiver): CaregiverResponseDto {
    return {
      id: caregiver.id,
      fullName: caregiver.fullName,
      photos: caregiver.photos,
      address: {
        street: caregiver.address.street,
        streetNumber: caregiver.address.number,
        postCode: caregiver.address.postCode,
        city: caregiver.address.city,
      },
      geocode: {
        lat: caregiver.geocode.lat,
        lng: caregiver.geocode.lng,
      },
      services: caregiver.services.map((service) => ({
        type: service.type,
        price: service.price,
      })),
      aboutTitle: caregiver.aboutTitle,
      aboutDescription: caregiver.aboutDescription,
      skills: caregiver.skills,
      availability: caregiver.availability,
      unavailableDays: caregiver.unavailableDays || [],
      petTypePreference: caregiver.petTypePreference as PetTypePreference[],
      dogAge: caregiver.dogAge as DogAge[],
      dogSize: caregiver.dogSize as DogSize[],
      certifications: caregiver.certifications,
      languages: caregiver.languages,
      mobility: caregiver.mobility,
      averageRating: caregiver.averageRating,
      totalReviews: caregiver.totalReviews,
    };
  }
}
