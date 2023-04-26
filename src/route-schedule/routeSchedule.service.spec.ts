import { Test, TestingModule } from '@nestjs/testing';
import { RouteScheduleService } from './routeSchedule.service';
import { JourneyService } from '../journey/journey.service';
import { EmailService } from '../email/email.service';

describe('ScheduleService', () => {
  let service: RouteScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteScheduleService,
        {
          provide: JourneyService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RouteScheduleService>(RouteScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
