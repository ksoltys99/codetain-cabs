import { IsNotEmpty } from 'class-validator';
import { Address } from '../../shared/address.entity';
import { AddUserDto } from './user.dto';

export class UserWithAddressDto extends AddUserDto {
  @IsNotEmpty()
  addressWithCoords: Address;
}
