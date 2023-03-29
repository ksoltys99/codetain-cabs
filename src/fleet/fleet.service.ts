import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { AddCarDto } from './dtos/addCar.dto';
import { DeleteCarDto } from './dtos/deleteCar.dto';
import { UpdateCarDto } from './dtos/updateCar.dto';

@Injectable()
export class FleetService {
  constructor(@InjectRepository(Car) private carRepository: Repository<Car>) {}

  async addCar(car: AddCarDto) {
    const newCar = this.carRepository.create(car);
    await this.carRepository.save(newCar);
    return newCar;
  }

  async updateCar(car: UpdateCarDto) {
    await this.carRepository.update(
      { vin: car.vin },
      {
        currentLocation: car.currentLocation,
        pricePerKmPLN: car?.pricePerKmPLN,
      },
    );
  }

  async getCars() {
    return this.carRepository.find();
  }

  async deleteCar(car: DeleteCarDto) {
    const result = await this.carRepository.delete({ vin: car.vin });
    if (!result.affected) return "Couldn't delete car of given vin number";
  }

  async getAvailableCars() {
    return this.carRepository.find({ where: { isAvailable: true } });
  }
}
