import { Test, TestingModule } from '@nestjs/testing';
import { ZoneService } from './zone.service';
import { Zone } from './zone.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

describe('ZoneService', () => {
  let zoneService: ZoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZoneService,
        {
          provide: getRepositoryToken(Zone),
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

    zoneService = module.get<ZoneService>(ZoneService);
  });

  it('should be defined', () => {
    expect(zoneService).toBeDefined();
  });

  describe('when adding new zone', () => {
    it('should return zone', () => {
      const mockZone = { voivodeship: 'zone name', postalCodePrefix: '68-320' };
      const result = zoneService.addZone(mockZone);
      expect(result).resolves.toBe(mockZone);
    });
  });

  describe('when deleting zone', () => {
    it('should throw exception if promise is rejected', () => {
      const result = zoneService.deleteZone('zone');
      expect(result).rejects.toThrow(HttpException);
    });
  });
});
