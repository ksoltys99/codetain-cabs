import {
  Controller,
  UseGuards,
  Get,
  Body,
  Delete,
  Post,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoleGuard } from '../role/role.guard';
import { AddCarDto } from './dtos/addCar.dto';
import { UpdateCarDto } from './dtos/updateCar.dto';
import { FleetService } from './fleet.service';
import { DeleteCarDto } from './dtos/deleteCar.dto';
import { Role } from 'src/role/role.enum';

@Controller('fleet')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Post()
  async addCar(@Body() car: AddCarDto) {
    if (car.price.value <= 0) return 'Price must be a positive number';
    return this.fleetService.addCar(car);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Put()
  async updateCar(@Body() car: UpdateCarDto) {
    return this.fleetService.updateCar(car);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Get('cars/available')
  async getAvailableCars() {
    return this.fleetService.getAvailableCars();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Get('cars')
  async getCars() {
    return this.fleetService.getCars();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UsePipes(ValidationPipe)
  @Delete()
  async deleteCar(@Body() car: DeleteCarDto, @Res() res) {
    await this.fleetService.deleteCar(car);
    return res.status(200).send('Car deleted');
  }
}
