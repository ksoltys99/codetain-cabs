import { IsNotEmpty, IsOptional } from 'class-validator';
import { PriceDto } from 'src/shared/dtos/price.dto';
import { CarStateDto } from './car-state.dto';

export class AddCarDto {
  @IsNotEmpty()
  vin: string;

  @IsNotEmpty()
  price: PriceDto;

  @IsNotEmpty()
  totalSeats: number;

  @IsNotEmpty()
  state: CarStateDto;
}
