import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { AddressDto } from './dtos/address.dto';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  addAddress(address: AddressDto) {
    const newAddress = this.addressRepository.create(address);
    return this.addressRepository.save(newAddress);
  }
}
