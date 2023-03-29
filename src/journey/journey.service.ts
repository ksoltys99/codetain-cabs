import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Zone } from './zone.entity';
import { AddZoneDto } from './dtos/add-zone.dto';
import { StandardRoute } from './standardRoute.entity';
import { MapsService } from 'src/maps/maps.service';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(StandardRoute)
    private routeRepository: Repository<StandardRoute>,
    private mapsService: MapsService,
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

  getZones() {
    return this.zoneRepository.find();
  }

  getTravelPrice(distanceInMeters: number, pricePerKm: number) {
    return (Math.ceil(distanceInMeters / 1000) * pricePerKm).toString() + 'PLN';
  }

  async createCustomTravel(
    startAddress: string,
    endAddress: string,
    carVin: string,
  ) {
    const startAddressPrefix = await this.mapsService.getPostalCodePrefix(
      startAddress,
    );
    const endAddressPrefix = await this.mapsService.getPostalCodePrefix(
      endAddress,
    );

    console.log(startAddressPrefix, endAddressPrefix);

    if (
      !(await this.zoneRepository.findOne({
        where: { postalCodePrefix: startAddressPrefix },
      }))
    )
      return 'Origin zone is not supported';

    if (
      !(await this.zoneRepository.findOne({
        where: { postalCodePrefix: endAddressPrefix },
      }))
    )
      return 'Destination zone is not supported';

    const travelData = this.mapsService.getTravelDetails(
      startAddress,
      endAddress,
    );
  }

  getPostalPrefix(address: string) {
    return this.mapsService.getPostalCodePrefix(address);
  }
}
