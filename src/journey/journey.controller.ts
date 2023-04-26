import {
  Controller,
  Get,
  Post,
  UseGuards,
  Put,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Body, Delete, UsePipes } from '@nestjs/common/decorators';
import { JourneyService } from './journey.service';
import { OrderTravelDto } from './dtos/orderTravel.dto';
import { RoleGuard } from '../role/role.guard';
import { AddRouteDto } from './dtos/addRoute.dto';
import { Role } from '../role/role.enum';
import { ChooseRouteDto } from './dtos/chooseRoute.dto';
import { MapsService } from '../maps/maps.service';
import { UserService } from '../user/user.service';
import { ZoneService } from '../zone/zone.service';
import { UpdateRouteDto } from './dtos/updateRoute.dto';

@Controller('journey')
export class JourneyController {
  constructor(
    private readonly journeyService: JourneyService,
    private mapsService: MapsService,
    private userService: UserService,
    private zoneService: ZoneService,
  ) {}

  @UseGuards(RoleGuard(Role.Admin))
  @Get('route/ordered')
  async getOrderedTravels() {
    return await this.journeyService.getOrderedTravels();
  }

  @UseGuards(RoleGuard(Role.User))
  @Get('route')
  async getStandardRoutes() {
    return await this.journeyService.getRoutes();
  }

  @UseGuards(RoleGuard(Role.User))
  @Get('route/upcoming')
  async getUpcomingRoutes() {
    return await this.journeyService.showUpcomingRoutes();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Delete('route')
  async deleteRoutes() {
    return await this.journeyService.deleteRoutes();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Put('route')
  async updateRoute(@Body() data: UpdateRouteDto) {
    return await this.journeyService.updateRoute(data);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Post('route')
  async addRoute(@Body() data: AddRouteDto, @Res() res: Response) {
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

    const { travelTime, distance } = travelData;
    const distanceInKm = Math.round(distance / 1000);

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

    const routeMetadata = {
      startAddress: startAddressWithCoords,
      endAddress: endAddressWithCoords,
      distance: distanceInKm,
      duration: travelTime,
      day: data.day,
      hour: data.hour,
    };

    await this.journeyService.addRoute(routeMetadata);
    return res.status(200).send('Route added');
  }

  @UseGuards(RoleGuard(Role.User))
  @UsePipes(ValidationPipe)
  @Post('route/search')
  async getRelatedRoutes(
    @Body() data: ChooseRouteDto,
    @Req() request: Request,
  ) {
    const { Authentication } = request.cookies;
    const loggedUser = await this.userService.getUserFromCookies(
      Authentication,
    );
    if (!data.startCity) data.startCity = loggedUser.addressWithCoords.city;

    if (!this.zoneService.checkZone(data.startCity))
      return 'Origin zone is not supported';
    if (!this.zoneService.checkZone(data.endCity))
      return 'Destination zone is not supported';

    return await this.journeyService.getRelatedTravels(
      data.startCity,
      data.endCity,
    );
  }

  @UseGuards(RoleGuard(Role.User))
  @UsePipes(ValidationPipe)
  @Post('route/order')
  async orderTravel(@Body() data: OrderTravelDto, @Req() request: Request) {
    const { Authentication } = request.cookies;
    const loggedUser = await this.userService.getUserFromCookies(
      Authentication,
    );
    return await this.journeyService.orderTravel(data.routeId, loggedUser);
  }

  @Get('route/confirm/:token')
  async confirmTravel(@Req() request: Request, @Res() response: Response) {
    const token = request.params.token;
    await this.journeyService.confirmTravel(token);
    return response.send('Your travel has been confirmed');
  }
}
