import { IsNotEmpty } from 'class-validator';
import { Address } from '../../shared/address.entity';
import { Days } from 'src/shared/days.type';

export class AddRouteDto {
  @IsNotEmpty()
  startAddress: Address;

  @IsNotEmpty()
  endAddress: Address;

  @IsNotEmpty()
  days: Days[];

  @IsNotEmpty()
  hour: string;
}
