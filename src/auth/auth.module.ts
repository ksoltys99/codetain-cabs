import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
    EmailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
