import { Field, InputType } from '@nestjs/graphql';

import { IsArray, IsDateString, IsOptional } from 'class-validator';

@InputType()
export class UpdateUnavailableDaysDto {
  @Field(() => [String], {
    description: 'List of unavailable dates (ISO date strings)',
  })
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  unavailableDays?: string[];
}
