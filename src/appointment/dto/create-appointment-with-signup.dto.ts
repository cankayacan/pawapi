import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PetOwnerDto {
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly fullAddress: string;
}

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  readonly street: string;

  @IsString()
  @IsNotEmpty()
  readonly streetNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly postCode: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;
}

export class PetDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly petType: string;
}

export class AppointmentDto {
  @IsDate()
  @Type(() => Date)
  readonly date: Date;

  @IsString()
  @IsNotEmpty()
  readonly reason: string;

  @IsString()
  @IsOptional()
  readonly otherReason: string;
}
