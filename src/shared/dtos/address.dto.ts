import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  postalCode: string;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  building: string;
}
