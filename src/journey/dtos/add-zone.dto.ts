import { IsNotEmpty } from 'class-validator';

export class AddZoneDto {
  @IsNotEmpty()
  voivodeship: string;

  @IsNotEmpty()
  postalCodePrefix: string;
}
