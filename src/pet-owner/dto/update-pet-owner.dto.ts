import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsOptional, IsString } from 'class-validator';

import { AddressInput } from './address-input.dto';

@InputType()
export class UpdatePetOwnerDto {
  @Field(() => String, { description: 'Full name of the pet owner' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @Field(() => String, { description: 'Email of the pet owner' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => String, { description: 'Mobile number of the pet owner' })
  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @Field(() => AddressInput, {
    description: 'The address of the owner',
    nullable: true,
  })
  @IsOptional()
  address?: AddressInput;
}
