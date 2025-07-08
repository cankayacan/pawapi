import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Pet } from 'src/db/schema/pet';

import { Gender } from '../types/gender';
import { PetType } from '../types/pet-type';
import { SterilizationStatus } from '../types/sterilization-status';

@ObjectType()
export class PetResponseDto {
  @Field(() => ID, { description: 'Id of the pet' })
  id: string;

  @Field(() => String, { description: 'Id of the owner' })
  ownerId: string;

  @Field(() => String, {
    description: 'Name of the pet',
  })
  name: string;

  @Field(() => PetType, {
    description: 'Type of the pet, typically cat or dog',
  })
  type: PetType;

  @Field(() => String, { description: 'Birthday of the pet', nullable: true })
  birthday: string | null;

  @Field(() => Gender, { description: 'Gender of the pet' })
  gender: Gender;

  @Field(() => SterilizationStatus, {
    description: 'Sterilization status of the pet',
  })
  sterilizationStatus: SterilizationStatus;

  @Field(() => String, {
    description: 'Presigned url of the avatar image',
    nullable: true,
  })
  avatarImage: string | null;

  static fromPet(pet: Pet, avatarImageUrl: string): PetResponseDto {
    return {
      id: pet.id,
      ownerId: pet.ownerId,
      name: pet.name,
      type: pet.type as PetType,
      birthday: pet.birthday?.toISOString() ?? null,
      gender: pet.gender as Gender,
      sterilizationStatus: pet.sterilizationStatus as SterilizationStatus,
      avatarImage: avatarImageUrl,
    };
  }
}
