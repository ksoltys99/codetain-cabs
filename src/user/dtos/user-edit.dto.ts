import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserEditDto {
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  surname?: string;

  @IsNotEmpty()
  @IsOptional()
  dateOfBirth?: Date;

  @IsNotEmpty()
  @IsOptional()
  address?: string;
}
