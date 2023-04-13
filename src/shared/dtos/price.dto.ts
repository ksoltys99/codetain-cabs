import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class PriceDto {
  @IsNotEmpty()
  @IsPositive()
  value: number;

  @IsOptional()
  currency?: string;
}
