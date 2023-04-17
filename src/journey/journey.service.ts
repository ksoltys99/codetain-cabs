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
import { EmailService } from '../email/email.service';
import { AddressDto } from '../shared/dtos/address.dto';
import { RouteMetadata } from './routeMetadata.interface';
import { AddRouteDto } from './dtos/add-route.dto';
import { Cron } from '@nestjs/schedule';
import { OrderedTravelMetadata } from './orderedTravelMetadata.interface';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

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

  async getRoutes() {
    return await this.routeRepository.find();
  }

  async getOrderedTravels() {
    return await this.orderedTravelRepository.find();
  }

  getTravelPrice(distanceInMeters: number, pricePerKm: number) {
    return Math.ceil(distanceInMeters / 1000) * pricePerKm;
  }

  async addRoute(data: AddRouteDto) {
    const detailedStartAddress = `${data.startAddress.street}, ${data.startAddress.postalCode} ${data.startAddress.city}`;
    const detailedEndAddress = `${data.endAddress.street}, ${data.endAddress.postalCode} ${data.endAddress.city}`;

    const startAddressCoords = await this.mapsService.getGeolocalisation(
      detailedStartAddress,
    );
    const endAddressCoords = await this.mapsService.getGeolocalisation(
      detailedEndAddress,
    );

    const travelData = await this.mapsService.getTravelDetails(
      detailedStartAddress,
      detailedEndAddress,
    );

    const startAddressWithCoords = {
      ...data.startAddress,
      coordsLat: startAddressCoords.lat,
      coordsLng: startAddressCoords.lng,
    };
    const endAddressWithCoords = {
      ...data.endAddress,
      coordsLat: endAddressCoords.lat,
      coordsLng: endAddressCoords.lng,
    };

    const { travelTime, distance } = travelData;
    const distanceInKm = Math.round(distance / 1000);

    const metadata: RouteMetadata = {
      startAddress: startAddressWithCoords,
      endAddress: endAddressWithCoords,
      distanceInKm: distanceInKm,
      duration: travelTime,
      days: data.days,
      hour: data.hour,
    };

    const route = this.routeRepository.create(metadata);
    return this.routeRepository.save(route);
  }

  async orderTravel(travelId: number, date: string, cookies: any) {
    const { Authentication } = cookies;
    const loggedUser = await this.userService.getUserFromCookies(
      Authentication,
    );

    const route = await this.routeRepository.findOne({
      where: { id: travelId },
      relations: {
        startAddress: true,
        endAddress: true,
      },
    });

    const availableCars = await this.fleetService.getAvailableCars();
    if (!availableCars)
      throw new HttpException(
        'No cars available. Please try again later',
        HttpStatus.GONE,
      );

    const choosenCar = availableCars[0];
    await this.fleetService.bookSeat(choosenCar);
    const price = this.getTravelPrice(
      parseInt(route.distance),
      choosenCar.price.value,
    );

    const confirmationCode = await this.emailService.createActivationLink(
      loggedUser.email,
      loggedUser.id,
    );

    const metadata: OrderedTravel = {
      route: route,
      price: { value: price, currency: 'PLN' },
      confirmationCode: confirmationCode,
      car: choosenCar,
      user: loggedUser,
      date: new Date(date),
      status: 'pending',
    };
    const travel = this.orderedTravelRepository.create(metadata);

    await this.orderedTravelRepository.save(travel);

    return {
      id: travel.id,
      status: travel.status,
      distance: travel.route.distance,
      time: travel.route.duration,
      date: travel.date,
      price: travel.price,
    };
  }

  async getRelatedTravels(
    startAddress: AddressDto,
    endAddress: AddressDto,
    cookies: any,
  ) {
    const { Authentication } = cookies;
    const loggedUser = await this.userService.getUserFromCookies(
      Authentication,
    );
    if (!startAddress) startAddress = loggedUser.addressWithCoords;

    if (!this.checkZone(startAddress)) return 'Origin zone is not supported';
    if (!this.checkZone(endAddress)) return 'Destination zone is not supported';

    const routes = await this.routeRepository.find();
    const filtered = routes.filter(
      (route) =>
        route.startAddress.city === startAddress.city &&
        route.endAddress.city === endAddress.city,
    );
    if (filtered)
      return {
        routes: filtered,
        message: 'Here are the routes that match your criteria',
      };
    return { routes: [], message: 'No routes matching your criteria' };
  }

  async confirmTravel(confirmationCode: string) {
    const travel = await this.orderedTravelRepository.findOne({
      where: { confirmationCode: confirmationCode },
      relations: {
        car: true,
      },
    });

    if (travel) {
      travel.status = 'confirmed';

      return await this.orderedTravelRepository.save(travel);
    }

    throw new HttpException('Wrong confirmation code', HttpStatus.BAD_REQUEST);
  }

  async getPostalPrefix(address: string) {
    return await this.mapsService.getPostalCodePrefix(address);
  }

  async checkZone(address: AddressDto) {
    const postalCodePrefix = address.postalCode.substring(0, 2);

    if (
      !(await this.zoneRepository.findOne({
        where: { postalCodePrefix: postalCodePrefix },
      }))
    )
      return false;

    return true;
  }

  @Cron('0 * * * * *')
  async handleNewOrders() {
    const newOrders = await this.orderedTravelRepository.find({
      where: { status: 'pending' },
      relations: { user: true },
    });

    if (!newOrders.length) return;
    newOrders.forEach(async (order: OrderedTravel) => {
      order.status = 'received';
      const travelMetadata: OrderedTravelMetadata = {
        startAddress: order.route.startAddress,
        endAddress: order.route.endAddress,
        distanceInKm: parseInt(order.route.distance),
        duration: order.route.duration,
        price: order.price,
        email: order.user.email,
        date: order.date,
        confirmationCode: order.confirmationCode,
      };
      await this.emailService.sendTravelConfirmationMail(travelMetadata);
    });
  }
}
