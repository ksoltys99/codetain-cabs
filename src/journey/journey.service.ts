import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandardRoute } from './standardRoute.entity';
import { MapsService } from '../maps/maps.service';
import { FleetService } from '../fleet/fleet.service';
import { OrderedTravel } from './orderedTravel.entity';
import { EmailService } from '../email/email.service';
import { RouteMetadata } from './routeMetadata.interface';
import { User } from '../user/user.entity';
import { UpcomingRoute } from './upcomingRoute.entity';
import { UpdateRouteDto } from './dtos/updateRoute.dto';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(StandardRoute)
    private routeRepository: Repository<StandardRoute>,
    private mapsService: MapsService,
    private fleetService: FleetService,
    @InjectRepository(OrderedTravel)
    private orderedTravelRepository: Repository<OrderedTravel>,
    private emailService: EmailService,
    @InjectRepository(UpcomingRoute)
    private upcomingRouteRepository: Repository<UpcomingRoute>,
    private sharedService: SharedService,
  ) {}

  async getRoutes() {
    return await this.routeRepository.find({
      relations: { startAddress: true, endAddress: true, day: true },
    });
  }

  async getOrderedTravels() {
    return await this.orderedTravelRepository.find({
      relations: { user: true },
    });
  }

  getTravelPrice(distanceInKm: number, pricePerKm: number) {
    return distanceInKm * pricePerKm;
  }

  async addRoute(data: RouteMetadata) {
    const route = this.routeRepository.create(data);
    route.day = data.day;
    const storedDay = await this.sharedService.getDay(data.day.name);

    if (storedDay) route.day = storedDay;

    try {
      await this.routeRepository.save(route);
    } catch (error) {
      throw new HttpException('Could not add route', HttpStatus.CONFLICT);
    }
  }

  async deleteRoutes() {
    return await this.routeRepository.clear();
  }

  async updateRoute(updateDto: UpdateRouteDto) {
    const route = await this.routeRepository.findOneBy({ id: updateDto.id });
    route.day = updateDto.day;
    route.hour = updateDto.hour;
    return await this.routeRepository.save(route);
  }

  async orderTravel(travelId: number, user: User) {
    const route = await this.upcomingRouteRepository.findOne({
      where: { id: travelId },
      relations: {
        route: { startAddress: true, endAddress: true },
      },
    });

    const availableCars = await this.fleetService.getAvailableCars();
    if (!availableCars.length)
      throw new HttpException(
        'No cars available. Please try again later',
        HttpStatus.GONE,
      );

    const choosenCar = availableCars[0];

    await this.fleetService.bookSeat(choosenCar);
    const price = this.getTravelPrice(
      route.route.distance,
      choosenCar.price.value,
    );

    const confirmationCode = await this.emailService.createActivationLink(
      user.email,
      user.id,
    );

    const metadata: OrderedTravel = {
      route: route.route,
      price: { value: price, currency: 'PLN' },
      confirmationCode: confirmationCode,
      car: choosenCar,
      user: user,
      date: route.date,
      status: 'pending',
    };
    const travel = this.orderedTravelRepository.create(metadata);

    await this.orderedTravelRepository.save(travel);

    return {
      id: travel.id,
      status: travel.status,
      distance: travel.route.distance + 'km',
      time: travel.route.duration,
      date: travel.date,
      price: travel.price,
    };
  }

  async getRelatedTravels(startCity: string, endCity: string) {
    const routes = await this.routeRepository.find({
      relations: { startAddress: true, endAddress: true },
    });
    const filtered = routes.filter(
      (route) =>
        route.startAddress.city === startCity &&
        route.endAddress.city === endCity,
    );
    if (filtered.length)
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

  async getPendingOrders() {
    return await this.orderedTravelRepository.find({
      where: { status: 'pending' },
      relations: {
        user: true,
        route: { startAddress: true, endAddress: true },
        price: true,
      },
    });
  }

  async saveOrders(orders: OrderedTravel[]) {
    return await this.orderedTravelRepository.save(orders);
  }

  async saveUpcomingRoutes(routes: UpcomingRoute[]) {
    return await this.upcomingRouteRepository.save(routes);
  }

  async showUpcomingRoutes() {
    const routes = await this.upcomingRouteRepository.find({
      relations: { route: { startAddress: true, endAddress: true } },
    });

    const upcoming = routes.filter((route: UpcomingRoute) => {
      const routeDateInMs = route.date.getTime();
      const dateNow = Date.now();

      return dateNow < routeDateInMs;
    });
    return upcoming;
  }
}
