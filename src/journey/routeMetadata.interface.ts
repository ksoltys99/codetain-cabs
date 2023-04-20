import { Days } from '../shared/days.type';
import { Address } from '../shared/address.entity';

export interface RouteMetadata {
  startAddress: Address;
  endAddress: Address;
  distanceInKm: number;
  duration: string;
  days: Days[];
  hour: string;
}
