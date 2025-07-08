import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GeocodeResponseDto {
  @Field(() => Float, { description: 'The longitude' })
  lng: number;

  @Field(() => Float, { description: 'The latitude' })
  lat: number;
}
