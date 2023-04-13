import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Zone } from './zone.entity';
import { AddZoneDto } from './dtos/add-zone.dto';
import { StandardRoute } from './standardRoute.entity';
import { MapsService } from '../maps/maps.service';
import { FleetService } from '../fleet/fleet.service';
import { UserService } from '../user/user.service';
import { OrderedTravel } from './orderedTravel.entity';
import { EmailService } from 'src/email/email.service';
import { AddressDto } from '../shared/dtos/address.dto';
import { TravelMetadata } from './dtos/travel-metadata.interface';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(StandardRoute)
    private routeRepository: Repository<StandardRoute>,
    private mapsService: MapsService,
    private fleetService: FleetService,
    private userService: UserService,
    @InjectRepository(OrderedTravel)
    private orderedTravelRepository: Repository<OrderedTravel>,
    private emailService: EmailService,
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

  getZone(postalCodePrefix: string) {
    return this.zoneRepository.findOneBy({ postalCodePrefix });
  }

  getOrderedTravels() {
    return this.orderedTravelRepository.find();
  }

  getTravelPrice(distanceInMeters: number, pricePerKm: number) {
    return Math.ceil(distanceInMeters / 1000) * pricePerKm;
  }

  async createCustomTravel(
    startAddress: AddressDto,
    endAddress: AddressDto,
    carVin: string,
    date: string,
    cookies: any,
  ) {
    const { Authentication } = cookies;
    const loggedUser = await this.userService.getUserFromCookies(
      Authentication,
    );
    if (!startAddress) startAddress = loggedUser.addressWithCoords;

    const startAddressPrefix = startAddress.postalCode.substring(0, 2);
    const endAddressPrefix = await this.mapsService.getPostalCodePrefix(
      endAddress.city,
    );

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

    const startAddressCoords = await this.mapsService.getGeolocalisation(
      startAddress.city,
    );
    const endAddressCoords = await this.mapsService.getGeolocalisation(
      endAddress.city,
    );

    const travelData = await this.mapsService.getTravelDetails(
      startAddress.city,
      endAddress.city,
    );

    const car = await this.fleetService.findCar(carVin);
    if (!car)
      throw new HttpException(
        "Couldn't find car of given vin number",
        HttpStatus.BAD_REQUEST,
      );

    const { travelTime, distance } = travelData;
    const distanceInKm = Math.round(distance / 1000);

    const price = this.getTravelPrice(travelData.distance, car.price.value);
    const confirmationCode = await this.emailService.createActivationLink(
      loggedUser.email,
      loggedUser.id,
    );

    const startAddressWithCoords = {
      ...startAddress,
      coordsLat: startAddressCoords.lat,
      coordsLng: startAddressCoords.lng,
    };
    const endAddressWithCoords = {
      ...endAddress,
      coordsLat: endAddressCoords.lat,
      coordsLng: endAddressCoords.lng,
    };

    const metadata: TravelMetadata = {
      startAddress: startAddressWithCoords,
      endAddress: endAddressWithCoords,
      distanceInKm: distanceInKm,
      duration: travelTime,
      price: { value: price, currency: 'PLN' },
      confirmationCode: confirmationCode,
      car: car,
      user: loggedUser,
      date: new Date(date),
      status: 'pending',
    };
    const travel = this.orderedTravelRepository.create(metadata);

    await this.orderedTravelRepository.save(travel);

    //should return travel_id, status, distance, date, price

    return {
      id: travel.id,
      status: travel.status,
      distance: travel.distanceInKm,
      time: travel.duration,
      date: travel.date,
      price: travel.price,
    };
  }

  //add additional step between confirmation and sending to user
  async chooseTravel() {}

  async confirmTravel(confirmationCode: string) {
    const travel = await this.orderedTravelRepository.findOne({
      where: { confirmationCode: confirmationCode },
      relations: {
        car: true,
      },
    });

    if (travel)
      return this.fleetService.changeStatus(travel.car.vin, {
        isAvailable: false,
      });
    throw new HttpException('Wrong confirmation code', HttpStatus.BAD_REQUEST);
  }

  getPostalPrefix(address: string) {
    return this.mapsService.getPostalCodePrefix(address);
  }
}
