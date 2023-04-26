import { IsNotEmpty } from 'class-validator';

export class OrderTravelDto {
  @IsNotEmpty()
  routeId: number;
}
