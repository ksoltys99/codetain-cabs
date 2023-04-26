import { IsNotEmpty, IsOptional } from 'class-validator';

export class ChooseRouteDto {
  @IsOptional()
  startCity: string;

  @IsNotEmpty()
  endCity: string;
}
