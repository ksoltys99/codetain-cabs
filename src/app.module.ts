import { Dependencies, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { AdministrationModule } from './administration/administration.module';
import { JourneyModule } from './journey/journey.module';
import { MapsModule } from './maps/maps.module';
import { FleetModule } from './fleet/fleet.module';
import { SharedModule } from './shared/shared.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ZoneModule } from './zone/zone.module';
import { RouteScheduleModule } from './route-schedule/routeSchedule.module';

@Dependencies(DataSource)
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    EmailModule,
    DatabaseModule,
    AdministrationModule,
    JourneyModule,
    MapsModule,
    FleetModule,
    SharedModule,
    ScheduleModule.forRoot(),
    ZoneModule,
    ScheduleModule,
    RouteScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
