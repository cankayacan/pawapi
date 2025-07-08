import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddressResponseDto {
  @Field(() => String, { description: 'The street name of the address' })
  street: string;

  @Field(() => String, { description: 'The street number of the address' })
  streetNumber: string;

  @Field(() => String, { description: 'The postal code of the address' })
  postCode: string;

  @Field(() => String, { description: 'The city of the address' })
  city: string;
}
