import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { JourneyService } from './journey.service';
import { Zone } from './zone.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

describe('JourneyService', () => {
  let service: JourneyService;
  let mockRepository: Repository<Zone>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JourneyService,
        {
          provide: getRepositoryToken(Zone),
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
      ],
    }).compile();

    service = module.get<JourneyService>(JourneyService);
    mockRepository = module.get(getRepositoryToken(Zone));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when adding new zone', () => {
    it('should return zone', () => {
      const mockZone = { voivodeship: 'zone name', postalCodePrefix: '68-320' };
      const result = service.addZone(mockZone);
      expect(result).resolves.toBe(mockZone);
    });
  });

  describe('when deleting zone', () => {
    it('should throw exception if promise is rejected', () => {
      const result = service.deleteZone('zone');
      expect(result).rejects.toThrow(HttpException);
    });
  });
});
