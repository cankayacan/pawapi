import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CaregiverServiceResponseDto {
  @Field(() => String, { description: 'Type of service offered' })
  type: string;

  @Field(() => Float, { description: 'Price of the service' })
  price: number;
}
