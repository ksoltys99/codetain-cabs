import { Test, TestingModule } from '@nestjs/testing';
import { SharedService } from './shared.service';
import { Address } from './address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Day } from './day.entity';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedService,
        {
          provide: getRepositoryToken(Address),
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            find: jest.fn((entity) => entity),
            update: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
        {
          provide: getRepositoryToken(Day),
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

    service = module.get<SharedService>(SharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
