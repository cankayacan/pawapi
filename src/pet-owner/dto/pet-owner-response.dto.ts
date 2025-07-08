import { Field, ID, ObjectType } from '@nestjs/graphql';

import { PetOwner } from 'src/db/schema/pet-owner';

import { AddressResponseDto } from './address-response.dto';
import { GeocodeResponseDto } from './geocode-response.dto';

@ObjectType()
export class PetOwnerResponseDto {
  @Field(() => ID, { description: 'Id of the pet owner' })
  id: string;

  @Field({ description: 'Full name of the pet owner' })
  fullName: string;

  @Field({ description: 'Email of the pet owner' })
  email: string;

  @Field({ description: 'Mobile number of the pet owner' })
  mobileNumber: string;

  @Field(() => AddressResponseDto, {
    description: 'The address of the owner',
    nullable: true,
  })
  address: AddressResponseDto | null;

  @Field(() => GeocodeResponseDto, {
    description: 'The geocode of the address',
    nullable: true,
  })
  geocode: GeocodeResponseDto | null;

  static fromPetOwner(petOwner: PetOwner): PetOwnerResponseDto {
    return {
      id: petOwner.id,
      fullName: petOwner.fullName,
      email: petOwner.email,
      mobileNumber: petOwner.mobileNumber,
      address: petOwner.address ?? null,
      geocode: petOwner.geocode ?? null,
    };
  }
}
