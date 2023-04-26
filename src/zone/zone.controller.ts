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
import { ZoneService } from './zone.service';
import { Request, Response } from 'express';
import { Body, UsePipes } from '@nestjs/common/decorators';
import { AddZoneDto } from './dtos/addZone.dto';
import { DeleteZoneDto } from './dtos/deleteZone.dto';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.enum';

@Controller('zone')
export class ZoneController {
  constructor(private zoneService: ZoneService) {}

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Post()
  async addZone(@Body() zoneData: AddZoneDto, @Res() res: Response) {
    await this.zoneService.addZone(zoneData);
    return res.status(200).send('Zone added');
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Delete()
  async deleteZone(@Body() data: DeleteZoneDto, @Res() res: Response) {
    await this.zoneService.deleteZone(data.postalCodePrefix);
    return res.status(200).send('Zone deleted');
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Get()
  async getZone() {
    return await this.zoneService.getZones();
  }
}
