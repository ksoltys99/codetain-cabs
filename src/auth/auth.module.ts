import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService, LocalStrategy],
})
export class AuthModule {}
