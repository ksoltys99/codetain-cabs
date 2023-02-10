import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('/auth/login')
export class LoginController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
