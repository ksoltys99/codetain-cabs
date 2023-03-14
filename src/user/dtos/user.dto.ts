import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  secret?: string;

  coordsLat?: string;
  coordsLng?: string;
}
