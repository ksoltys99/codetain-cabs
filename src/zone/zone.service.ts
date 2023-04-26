import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Zone } from './zone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { AddZoneDto } from '../zone/dtos/addZone.dto';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
  ) {}

  async addZone(zone: AddZoneDto) {
    try {
      const newZone = this.zoneRepository.create(zone);
      await this.zoneRepository.save(newZone);
      return newZone;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'That zone already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
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

  async getZones() {
    return await this.zoneRepository.find();
  }

  async getZone(postalCodePrefix: string) {
    return await this.zoneRepository.findOneBy({ postalCodePrefix });
  }

  async checkZone(postalCodePrefix: string) {
    return !(await this.zoneRepository.findOne({
      where: { postalCodePrefix: postalCodePrefix },
    }))
      ? false
      : true;
  }
}
