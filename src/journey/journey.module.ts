import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { Zone } from './zone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardRoute } from './standardRoute.entity';
import { MapsModule } from 'src/maps/maps.module';

@Module({
  imports: [TypeOrmModule.forFeature([Zone, StandardRoute]), MapsModule],
  providers: [JourneyService],
  controllers: [JourneyController],
})
export class JourneyModule {}
