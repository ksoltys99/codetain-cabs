import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserDto } from 'src/dtos/user.dto';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  addUser(addUserDto: AddUserDto) {
    console.log(addUserDto);
    const newUser = this.userRepository.create(addUserDto);
    return this.userRepository.save(newUser);
  }
}
