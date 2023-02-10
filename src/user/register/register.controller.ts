import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AddUserDto } from '../user.dto';
import { UserService } from '../user.service';

@Controller('register')
export class RegisterController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  addUser(@Body() addUserDto: AddUserDto) {
    this.authService.register(addUserDto);
  }
}
