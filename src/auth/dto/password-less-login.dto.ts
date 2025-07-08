import { IsEmail } from 'class-validator';

export class PasswordLessLoginDto {
  @IsEmail()
  email: string;
}
