import { Test, TestingModule } from '@nestjs/testing';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import { MapsService } from '../maps/maps.service';
import { UserService } from '../user/user.service';
import { ZoneService } from '../zone/zone.service';

describe('JourneyController', () => {
  let controller: JourneyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JourneyController],
      providers: [
        { provide: JourneyService, useValue: {} },
        { provide: MapsService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: ZoneService, useValue: {} },
      ],
    }).compile();

    controller = module.get<JourneyController>(JourneyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
