import { IsNotEmpty } from 'class-validator';
import { PriceDto } from '../../shared/dtos/price.dto';
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
