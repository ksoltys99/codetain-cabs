import {
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
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

  @Post('route/custom')
  async createCustomRoute(@Body() data: CustomRouteDto) {
    return await this.journeyService.createCustomTravel(
      data.startAddress,
      data.endAddress,
      data.vin,
    );
  }

  //temp
  @Post('postal')
  async getPostalCode(@Body() data) {
    return this.journeyService.getPostalPrefix(data.address);
  }
}
