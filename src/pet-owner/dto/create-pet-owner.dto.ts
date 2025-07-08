import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AddressInput } from './address-input.dto';

@InputType()
export class CreatePetOwnerDto {
  @Field(() => String, { description: 'Full name of the pet owner' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field(() => String, { description: 'Email of the pet owner' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { description: 'Mobile number of the pet owner' })
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @Field(() => AddressInput, { description: 'Address of the pet owner' })
  @IsOptional()
  address?: AddressInput;
}
