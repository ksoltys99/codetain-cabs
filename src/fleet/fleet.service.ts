import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { AddCarDto } from './dtos/addCar.dto';
import { DeleteCarDto } from './dtos/deleteCar.dto';
import { UpdateCarDto } from './dtos/updateCar.dto';
import { Price } from 'src/shared/price.entity';
import { CarStateDto } from './dtos/car-state.dto';

@Injectable()
export class FleetService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
  ) {}

  async addCar(car: AddCarDto) {
    const newCar = this.carRepository.create(car);

    const price = await this.priceRepository.findOne({
      where: {
        value: car.price.value,
        currency: car.price.currency,
      },
    });
    if (price) newCar.price = price;

    await this.carRepository.save(newCar);
    return newCar;
  }

  async updateCar(car: UpdateCarDto) {
    await this.carRepository.update(
      { vin: car.vin },
      {
        state: car.state,
        price: car?.price,
      },
    );
  }

  getCars() {
    return this.carRepository.find({
      relations: { price: true, state: true },
    });
  }

  async deleteCar(car: DeleteCarDto) {
    const result = await this.carRepository.delete({ vin: car.vin });
    if (!result.affected) return "Couldn't delete car of given vin number";
    return 'Car deleted succesfully';
  }

  async getAvailableCars() {
    const cars = await this.carRepository.find({
      relations: { state: true },
    });

    return cars.find((car) => car.state.isAvailable === true);
  }

  findCar(vin: string) {
    return this.carRepository.findOne({
      where: { vin: vin },
      relations: { price: true },
    });
  }

  async changeStatus(vin: string, state: CarStateDto) {
    const car = await this.carRepository.findOneBy({ vin });
    car.state.isAvailable = state.isAvailable;
    return this.carRepository.save(car);
  }
}
