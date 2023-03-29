import { IsNotEmpty, IsOptional } from 'class-validator';

export class CustomRouteDto {
  @IsOptional()
  startAddress: string;

  @IsNotEmpty()
  endAddress: string;

  @IsNotEmpty()
  vin: string;
}
