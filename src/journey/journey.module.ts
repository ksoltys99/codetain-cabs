import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { Zone } from './zone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Zone])],
  providers: [JourneyService],
  controllers: [JourneyController],
})
export class JourneyModule {}
