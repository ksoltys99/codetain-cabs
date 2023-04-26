import { IsNotEmpty } from 'class-validator';

export class DeleteZoneDto {
  @IsNotEmpty()
  postalCodePrefix: string;
}
