import { Module } from '@nestjs/common';
import { FleetService } from './fleet.service';
import { FleetController } from './fleet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarState } from './car-state.entity';
import { Price } from 'src/shared/price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarState, Price])],
  providers: [FleetService],
  controllers: [FleetController],
  exports: [FleetService],
})
export class FleetModule {}
