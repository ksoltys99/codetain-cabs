import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { RegisterController } from './register/register.controller';
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef } from '@nestjs/common/utils';
import { EmailModule } from 'src/email/email.module';
import { LoginController } from './login/login.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    EmailModule,
  ],
  controllers: [UserController, RegisterController, LoginController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
