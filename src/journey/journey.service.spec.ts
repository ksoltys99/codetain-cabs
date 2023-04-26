import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { JourneyService } from './journey.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StandardRoute } from './standardRoute.entity';
import { UpcomingRoute } from './upcomingRoute.entity';
import { OrderedTravel } from './orderedTravel.entity';
import { MapsService } from '../maps/maps.service';
import { FleetService } from '../fleet/fleet.service';
import { EmailService } from '../email/email.service';
import { SharedService } from '../shared/shared.service';

describe('JourneyService', () => {
  let service: JourneyService;
  let routeRepository: Repository<StandardRoute>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JourneyService,
        {
          provide: getRepositoryToken(StandardRoute),
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
        {
          provide: getRepositoryToken(UpcomingRoute),
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            find: jest.fn((entity) => entity),
            update: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
        {
          provide: getRepositoryToken(OrderedTravel),
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            find: jest.fn((entity) => entity),
            update: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
        {
          provide: MapsService,
          useValue: {},
        },
        {
          provide: FleetService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: SharedService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<JourneyService>(JourneyService);
    routeRepository = module.get(getRepositoryToken(StandardRoute));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
