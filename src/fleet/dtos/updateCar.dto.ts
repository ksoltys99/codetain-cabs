import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class UpdateCarDto {
  @IsNotEmpty()
  vin: string;

  @IsNotEmpty()
  currentLocation: string;

  @IsOptional()
  @IsPositive()
  pricePerKmPLN?: number;
}
