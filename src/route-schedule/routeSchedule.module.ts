import { Module } from '@nestjs/common';
import { RouteScheduleService } from './routeSchedule.service';
import { JourneyModule } from '../journey/journey.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [JourneyModule, EmailModule],
  providers: [RouteScheduleService],
})
export class RouteScheduleModule {}
