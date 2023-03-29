import { Module } from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { AdministrationController } from './administration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { EmailModule } from '../email/email.module';
import { Address } from 'src/user/adress.entity';
import { MapsModule } from 'src/maps/maps.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Address]),
    EmailModule,
    MapsModule,
  ],
  providers: [AdministrationService],
  controllers: [AdministrationController],
})
export class AdministrationModule {}
