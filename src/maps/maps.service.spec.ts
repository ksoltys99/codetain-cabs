import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Coords } from './coords.interface';
import { MapsService } from './maps.service';

describe('MapsService', () => {
  let service: MapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapsService, ConfigService],
    }).compile();

    service = module.get<MapsService>(MapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`when geocoding user's localisation`, () => {
    let response: Coords = { lat: '123', lng: '456' };

    it('should return promise with coords object', async () => {
      jest
        .spyOn(service, 'getGeolocalisation')
        .mockImplementation(async () => response);

      expect(await service.getGeolocalisation('')).toBe(response);
    });
  });
});
