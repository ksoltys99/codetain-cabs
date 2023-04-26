import { Test, TestingModule } from '@nestjs/testing';
import { FleetService } from './fleet.service';
import { Car } from './car.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Price } from '../shared/price.entity';
import { Repository } from 'typeorm';

describe('FleetService', () => {
  let service: FleetService;
  let carRepository: Repository<Car>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FleetService,
        {
          provide: getRepositoryToken(Car),
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            find: jest.fn((entity) => entity),
            update: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
        {
          provide: getRepositoryToken(Price),
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            find: jest.fn((entity) => entity),
            update: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
      ],
    }).compile();

    service = module.get<FleetService>(FleetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
