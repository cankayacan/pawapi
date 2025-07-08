import { Field, InputType } from '@nestjs/graphql';

import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddressInput {
  @Field(() => String, { description: 'The street name of the address' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @Field(() => String, { description: 'The street number of the address' })
  @IsString()
  @IsNotEmpty()
  streetNumber: string;

  @Field(() => String, { description: 'The postal code of the address' })
  @IsString()
  @IsNotEmpty()
  postCode: string;

  @Field(() => String, { description: 'The city of the address' })
  @IsString()
  @IsNotEmpty()
  city: string;
}
