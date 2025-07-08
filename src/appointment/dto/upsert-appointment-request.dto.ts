import { Field, InputType } from '@nestjs/graphql';

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpsertAppointmentRequestDto {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String)
  readonly petId: string;

  @IsDate()
  @Type(() => Date)
  @Field(() => String)
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  readonly reason: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly otherReason: string | null;

  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  readonly isConfirmedByPetOwner?: boolean = false;
}
