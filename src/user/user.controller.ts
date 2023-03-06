import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { Body, UsePipes } from '@nestjs/common/decorators';
import { UserEditDto } from './dtos/user-edit.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/update')
  @UsePipes(ValidationPipe)
  async updateProfile(@Body() userData: UserEditDto, @Res() res: Response) {
    await this.userService.updateProfile(userData);
    return res.status(200).send('Profile updated');
  }
}
