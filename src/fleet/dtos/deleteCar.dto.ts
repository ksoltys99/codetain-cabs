import { IsNotEmpty } from 'class-validator';

export class DeleteCarDto {
  @IsNotEmpty()
  vin: string;
}
