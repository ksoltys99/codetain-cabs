import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class AddCarDto {
  @IsNotEmpty()
  vin: string;

  @IsNotEmpty()
  currentLocation: string;

  @IsNotEmpty()
  @IsPositive()
  pricePerKmPLN: number;

  @IsNotEmpty()
  totalSeats: number;

  @IsOptional()
  takenSeats?: number;

  @IsOptional()
  isAvailable?: boolean;
}
