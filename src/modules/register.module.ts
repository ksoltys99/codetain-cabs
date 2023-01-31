import { Module } from '@nestjs/common';
import { RegisterController } from '../controllers/register/register.controller';
import { RegisterService } from '../services/register/register.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
