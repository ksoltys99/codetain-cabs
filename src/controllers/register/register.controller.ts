import { Controller, Post, Req } from '@nestjs/common';
import { RegisterService } from 'src/services/register/register.service';
import { Request } from 'express';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  addUser(@Req() request: Request): void {
    const user = request.body;
    return this.registerService.addUser(user);
  }
}
