import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { AddressDto } from './dtos/address.dto';
import { Day } from './day.entity';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(Day) private dayRepository: Repository<Day>,
  ) {}

  async addAddress(address: AddressDto) {
    const newAddress = this.addressRepository.create(address);
    return await this.addressRepository.save(newAddress);
  }

  async getDay(day: string) {
    return await this.dayRepository.findOneBy({ name: day });
  }

  async getDays() {
    return await this.dayRepository.find();
  }
}
