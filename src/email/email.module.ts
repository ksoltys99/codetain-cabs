import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_KEY_ACTIVATION,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
