import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { Zone } from './zone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardRoute } from './standardRoute.entity';
import { MapsModule } from '../maps/maps.module';
import { FleetModule } from '../fleet/fleet.module';
import { UserModule } from '../user/user.module';
import { OrderedTravel } from './orderedTravel.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Zone, StandardRoute, OrderedTravel]),
    MapsModule,
    FleetModule,
    UserModule,
    EmailModule,
  ],
  providers: [JourneyService],
  controllers: [JourneyController],
  exports: [JourneyService],
})
export class JourneyModule {}
