import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDeleteDto {
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
