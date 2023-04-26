import { Price } from '../shared/price.entity';
import { Address } from '../shared/address.entity';

export interface OrderedTravelMetadata {
  startAddress: Address;
  endAddress: Address;
  distanceInKm: number;
  duration: string;
  price: Price;
  email: string;
  date: Date;
  confirmationCode: string;
}
