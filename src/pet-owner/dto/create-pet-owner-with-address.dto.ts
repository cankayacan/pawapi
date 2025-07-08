import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePetOwnerWithFullAddressDto {
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

  @Field(() => String, {
    description: 'Full address of the pet owner',
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  fullAddress: string;
}
