import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterService } from 'src/services/register/register.service';
import { AddUserDto } from 'src/dtos/user.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @UsePipes(ValidationPipe)
  addUser(@Body() addUserDto: AddUserDto) {
    return this.registerService.addUser(addUserDto);
  }
}
