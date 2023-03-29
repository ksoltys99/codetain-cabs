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
import { RoleGuard } from 'src/role/role.guard';
import { AddCarDto } from './dtos/addCar.dto';
import { UpdateCarDto } from './dtos/updateCar.dto';
import { FleetService } from './fleet.service';
import { DeleteCarDto } from './dtos/deleteCar.dto';

@Controller('fleet')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @UseGuards(RoleGuard)
  @UsePipes(ValidationPipe)
  @Post()
  addCar(@Body() car: AddCarDto) {
    return this.fleetService.addCar(car);
  }

  @UseGuards(RoleGuard)
  @UsePipes(ValidationPipe)
  @Put()
  updateCar(@Body() car: UpdateCarDto) {
    return this.fleetService.updateCar(car);
  }

  @UseGuards(RoleGuard)
  @UsePipes(ValidationPipe)
  @Get()
  getCars() {
    return this.fleetService.getCars();
  }

  @UseGuards(RoleGuard)
  @UsePipes(ValidationPipe)
  @Delete()
  async deleteCar(@Body() car: DeleteCarDto, @Res() res) {
    await this.fleetService.deleteCar(car);
    return res.status(200).send('Car deleted');
  }
}
