import {
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Body, UsePipes } from '@nestjs/common/decorators';
import { JourneyService } from './journey.service';
import { AddZoneDto } from './dtos/add-zone.dto';
import { DeleteZoneDto } from './dtos/delete-zone.dto';
import { OrderTravelDto } from './dtos/orderTravel.dto';
import { RoleGuard } from 'src/role/role.guard';
import { AddRouteDto } from './dtos/add-route.dto';
import { Role } from 'src/role/role.enum';
import { ChooseRouteDto } from './dtos/chooseRoute.dto';

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Post('zone')
  async addZone(@Body() zoneData: AddZoneDto, @Res() res: Response) {
    await this.journeyService.addZone(zoneData);
    return res.status(200).send('Zone added');
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Delete('zone')
  async deleteZone(@Body() data: DeleteZoneDto, @Res() res: Response) {
    await this.journeyService.deleteZone(data.postalCodePrefix);
    return res.status(200).send('Zone deleted');
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Get('zone')
  async getZone() {
    return await this.journeyService.getZones();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Get('route/ordered')
  async getOrderedTravels() {
    return await this.journeyService.getOrderedTravels();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Post('route')
  async addRoute(@Body() data: AddRouteDto, @Req() request: Request) {
    return await this.journeyService.addRoute(data);
  }

  @UseGuards(RoleGuard(Role.User))
  @Post('route/show')
  async getRoutes(@Body() data: ChooseRouteDto, @Req() request: Request) {
    return await this.journeyService.getRelatedTravels(
      data.startAddress,
      data.endAddress,
      request.cookies,
    );
  }

  @UseGuards(RoleGuard(Role.User))
  @Post('route/order')
  async orderTravel(@Body() data: OrderTravelDto, @Req() request: Request) {
    return await this.journeyService.orderTravel(
      data.routeId,
      data.date,
      request.cookies,
    );
  }

  @Get('route/confirm/:token')
  async confirmTravel(@Req() request: Request) {
    const token = request.params.token;
    return this.journeyService.confirmTravel(token);
  }
}
