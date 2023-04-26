import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Price } from './price.entity';
import { SharedService } from './shared.service';
import { Day } from './day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Price, Day])],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
