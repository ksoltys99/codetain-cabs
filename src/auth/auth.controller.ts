import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  HttpCode,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { AddUserDto } from 'src/user/dtos/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return res.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return res.sendStatus(200);
  }

  @HttpCode(200)
  @Post('register')
  @UsePipes(ValidationPipe)
  async addUser(@Body() addUserDto: AddUserDto, @Res() res: Response) {
    await this.authService.register(addUserDto);
    return res
      .status(200)
      .json('Account registered. Verification link has been sent.');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() req: RequestWithUser) {
    const user = req.user;
    user.password = undefined;
    return user;
  }

  @Get('activate/:token')
  activate(@Req() request: RequestWithUser) {
    const token = request.params.token;
    return this.userService.confirmUser(token);
  }
}
