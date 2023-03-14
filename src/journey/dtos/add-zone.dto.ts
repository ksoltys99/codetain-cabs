import { IsNotEmpty } from 'class-validator';

export class AddZoneDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  postalCode: string;
}
