import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProfileResponseDto {
  @Field(() => String)
  fullName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  mobileNumber: string;
}
