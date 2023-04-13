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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { Body, UsePipes } from '@nestjs/common/decorators';
import { JourneyService } from './journey.service';
import { AddZoneDto } from './dtos/add-zone.dto';
import { DeleteZoneDto } from './dtos/delete-zone.dto';
import { CustomRouteDto } from './dtos/custom-route.dto';

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('zone')
  async addZone(@Body() zoneData: AddZoneDto, @Res() res: Response) {
    await this.journeyService.addZone(zoneData);
    return res.status(200).send('Zone added');
  }

  @UseGuards(JwtAuthGuard)
  @Delete('zone')
  async deleteZone(@Body() data: DeleteZoneDto, @Res() res: Response) {
    await this.journeyService.deleteZone(data.postalCodePrefix);
    return res.status(200).send('Zone deleted');
  }

  @UseGuards(JwtAuthGuard)
  @Get('zone')
  async getZone() {
    return this.journeyService.getZones();
  }

  @UseGuards(JwtAuthGuard)
  @Get('ordered')
  async getOrderedTravels() {
    return this.journeyService.getOrderedTravels();
  }

  @UseGuards(JwtAuthGuard)
  @Post('route/custom')
  async createCustomRoute(
    @Body() data: CustomRouteDto,
    @Req() request: Request,
  ) {
    return await this.journeyService.createCustomTravel(
      data.startAddress,
      data.endAddress,
      data.vin,
      data.date,
      request.cookies,
    );
  }

  @Get('route/confirm/:token')
  async confirmTravel(@Req() request: Request) {
    const token = request.params.token;
    return this.journeyService.confirmTravel(token);
  }

  //temp
  @Post('postal')
  async getPostalCode(@Body() data) {
    return this.journeyService.getPostalPrefix(data.address);
  }
}
