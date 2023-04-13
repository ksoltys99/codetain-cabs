import { IsNotEmpty, IsOptional } from 'class-validator';
import { Address } from '../../shared/address.entity';

export class CustomRouteDto {
  @IsOptional()
  startAddress: Address;

  @IsNotEmpty()
  endAddress: Address;

  @IsNotEmpty()
  vin: string;

  @IsNotEmpty()
  date: string;
}
