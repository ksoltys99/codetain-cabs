import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Zone } from './zone.entity';
import { AddZoneDto } from './dtos/add-zone.dto';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
  ) {}
  async addZone(zone: AddZoneDto) {
    const newZone = this.zoneRepository.create(zone);
    await this.zoneRepository.save(newZone);
    return newZone;
  }
  async deleteZone(postalCodePrefix: string) {
    const result: DeleteResult = await this.zoneRepository.delete({
      postalCodePrefix: postalCodePrefix,
    });
    if (!result.affected)
      throw new HttpException(
        'Could not delete resource',
        HttpStatus.BAD_REQUEST,
      );
  }
}
