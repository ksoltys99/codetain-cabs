import {
  Controller,
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

@Controller('zone')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async addZone(@Body() zoneData: AddZoneDto, @Res() res: Response) {
    await this.journeyService.addZone(zoneData);
    return res.status(200).send('Zone added');
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteZone(@Body() name: string, @Res() res: Response) {
    await this.journeyService.deleteZone(name);
    return res.status(200).send('Zone deleted');
  }
}
