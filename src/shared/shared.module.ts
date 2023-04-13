import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Price } from './price.entity';
import { SharedService } from './shared.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Price])],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
