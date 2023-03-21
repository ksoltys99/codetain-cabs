import { IsNotEmpty } from 'class-validator';
import { Address } from '../adress.entity';
import { AddUserDto } from './user.dto';

export class UserWithAddressDto extends AddUserDto {
  // @IsNotEmpty()
  // coordsLat?: string;

  // @IsNotEmpty()
  // coordsLng?: string;

  @IsNotEmpty()
  addressWithCoords: Address;
}
