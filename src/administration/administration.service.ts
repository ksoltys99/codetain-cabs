import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/user/user-role.entity';
import { User } from 'src/user/user.entity';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class AdministrationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async getUsers() {
    return this.userRepository.find({
      relations: {
        role: true,
      },
    });
  }

  async deleteUser(id: number, email: string) {
    const result: DeleteResult = await this.userRepository.delete({ id: id });
    if (!result.affected)
      throw new HttpException(
        'User with that id does not exist',
        HttpStatus.BAD_REQUEST,
      );
  }

  async clearRepositories() {
    this.userRepository.clear();
  }
}
