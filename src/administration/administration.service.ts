import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { UserDeleteDto } from '../user/dtos/user-delete.dto';
import { User } from '../user/user.entity';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class AdministrationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async getUsers() {
    return this.userRepository.find({
      relations: {
        role: true,
        addressWithCoords: true,
      },
    });
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
