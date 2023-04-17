import { IsNotEmpty, IsOptional } from 'class-validator';
import { Address } from '../../shared/address.entity';

export class ChooseRouteDto {
  @IsOptional()
  startAddress: Address;

  @IsNotEmpty()
  endAddress: Address;
}
