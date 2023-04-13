import { Car } from '../../fleet/car.entity';
import { Address } from '../../shared/address.entity';
import { Price } from '../../shared/price.entity';
import { User } from '../../user/user.entity';

export interface TravelMetadata {
  startAddress: Address;
  endAddress: Address;
  distanceInKm: number;
  duration: string;
  price: Price;
  confirmationCode: string;
  car: Car;
  user: User;
  date: Date;
  status: 'pending' | 'received' | 'confirmed';
}
