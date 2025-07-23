import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DayAvailabilityDto {
  @Field(() => [String], { nullable: true })
  Monday?: string[];

  @Field(() => [String], { nullable: true })
  Tuesday?: string[];

  @Field(() => [String], { nullable: true })
  Wednesday?: string[];

  @Field(() => [String], { nullable: true })
  Thursday?: string[];

  @Field(() => [String], { nullable: true })
  Friday?: string[];

  @Field(() => [String], { nullable: true })
  Saturday?: string[];

  @Field(() => [String], { nullable: true })
  Sunday?: string[];
}
