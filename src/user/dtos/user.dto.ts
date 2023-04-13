import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { AddressDto } from 'src/shared/dtos/address.dto';

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
  address: AddressDto;

  @IsOptional()
  secret?: string;
}
