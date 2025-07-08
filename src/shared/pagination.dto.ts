import { Field, InputType, Int } from '@nestjs/graphql';

import { IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class PaginationDto {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsInt()
  @IsOptional()
  @Min(1)
  limit: number = 10;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  offset: number = 0;
}
