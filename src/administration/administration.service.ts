import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { UserDeleteDto } from '../user/dtos/user-delete.dto';
import { User } from '../user/user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { Address } from '../shared/address.entity';
import { MapsService } from '../maps/maps.service';

@Injectable()
export class AdministrationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private emailService: EmailService,
    private mapsService: MapsService,
  ) {}

  async getUsers() {
    return this.userRepository.find({
      relations: {
        role: true,
        addressWithCoords: true,
      },
    });
  }

  async getAddresses() {
    return this.addressRepository.find();
  }

  async deleteUser(deleteDto: UserDeleteDto) {
    const result: DeleteResult = await this.userRepository.delete({
      id: deleteDto.id,
    });
    if (!result.affected)
      throw new HttpException(
        'User with that id does not exist',
        HttpStatus.BAD_REQUEST,
      );

    this.emailService.sendDeletionMail(deleteDto.email);
  }

  async clearRepositories() {
    this.userRepository.clear();
  }
}
