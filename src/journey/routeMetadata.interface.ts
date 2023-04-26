import { Address } from '../shared/address.entity';
import { Day } from '../shared/day.entity';

export interface RouteMetadata {
  startAddress: Address;
  endAddress: Address;
  distance: number;
  duration: string;
  day: Day;
  hour: string;
}
