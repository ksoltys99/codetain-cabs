import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { EmailModule } from '../email/email.module';
import { Role } from '../user/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
