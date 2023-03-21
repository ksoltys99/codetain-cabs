import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { EmailModule } from '../email/email.module';
import { Role } from '../role/role.entity';
import { Address } from './adress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Address]), EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
