import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { CarState } from '../car-state.entity';
import { PriceDto } from 'src/shared/dtos/price.dto';

export class UpdateCarDto {
  @IsNotEmpty()
  vin: string;

  @IsNotEmpty()
  state: CarState;

  @IsOptional()
  price?: PriceDto;
}
