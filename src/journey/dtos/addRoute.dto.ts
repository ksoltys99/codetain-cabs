import { IsNotEmpty } from 'class-validator';
import { Address } from '../../shared/address.entity';
import { IDay } from '../../shared/day.interface';

export class AddRouteDto {
  @IsNotEmpty()
  startAddress: Address;

  @IsNotEmpty()
  endAddress: Address;

  @IsNotEmpty()
  day: IDay;

  @IsNotEmpty()
  hour: string;
}
