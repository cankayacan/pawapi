import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CaregiverGeocodeResponseDto {
  @Field(() => Float, { description: 'The latitude' })
  lat: number;

  @Field(() => Float, { description: 'The longitude' })
  lng: number;
}
