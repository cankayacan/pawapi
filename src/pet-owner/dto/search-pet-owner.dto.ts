import { Field, InputType } from '@nestjs/graphql';

import { IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchPetOwnerDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  mobileNumber?: string;
}
