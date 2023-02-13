import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/update')
  updateProfile(@Request() req) {
    return this.userService.updateProfile(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  deleteUser(@Request() req) {
    return this.userService.deleteUser(req.params.id);
  }
}
