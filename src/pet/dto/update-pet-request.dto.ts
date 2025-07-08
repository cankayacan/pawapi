import { Field, InputType } from '@nestjs/graphql';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { Gender } from '../types/gender';
import { PetType } from '../types/pet-type';
import { SterilizationStatus } from '../types/sterilization-status';

@InputType()
export class UpdatePetRequestDto {
  @Field({ description: 'The id of the pet to update' })
  id: string;

  @IsString()
  @Field(() => String, { description: 'Name of the pet' })
  readonly name: string;

  @IsEnum(PetType)
  @Field(() => PetType, {
    description: 'Type of the pet (typically cat or dog)',
  })
  readonly type: PetType;

  @IsEnum(Gender)
  @Field(() => Gender, { description: 'Gender of the pet' })
  readonly gender: Gender;

  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Birthday of the pet', nullable: true })
  readonly birthday?: string | null;

  @IsEnum(SterilizationStatus)
  @Field(() => SterilizationStatus, {
    description: 'Sterilization status of the pet',
  })
  readonly sterilizationStatus: SterilizationStatus;

  @IsString()
  @IsOptional()
  @Field(() => String, {
    description: 'Local path of the uploaded avatar image',
    nullable: true,
  })
  readonly avatarFilePath?: string | null;
}
