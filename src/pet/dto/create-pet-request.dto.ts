import { Field, InputType } from '@nestjs/graphql';

import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

import { Gender } from '../types/gender';
import { PetType } from '../types/pet-type';
import { SterilizationStatus } from '../types/sterilization-status';

@InputType()
export class CreatePetRequestDto {
  @IsString()
  @Field(() => String, {
    description: 'Name of the pet',
  })
  readonly name: string;

  @IsEnum(PetType)
  @Field(() => PetType, {
    description: 'Type of the pet, typically cat or dog',
  })
  readonly type: PetType;

  @IsDate()
  @Type(() => Date)
  @Field(() => String, { description: 'Birthday of the pet' })
  readonly birthday?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, {
    description: 'Local path of the uploaded avatar image',
    nullable: true,
  })
  readonly avatarFilePath?: string;

  @IsEnum(Gender)
  @Field(() => Gender, { description: 'Gender of the pet' })
  readonly gender: Gender;

  @IsEnum(SterilizationStatus)
  @Field(() => SterilizationStatus, {
    description: 'Sterilization status of the pet',
  })
  readonly sterilizationStatus: SterilizationStatus;
}
