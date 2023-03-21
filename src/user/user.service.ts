import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { User } from '../user/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { UserEditDto } from './dtos/user-edit.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../role/role.entity';
import { ConfigService } from '@nestjs/config';
import { UserWithAddressDto } from './dtos/userWithCoords.dto';
import { Address } from './adress.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}
  async addUser(addUserDto: UserWithAddressDto) {
    const newUser = this.userRepository.create(addUserDto);
    newUser.confirmationCode = await this.emailService.createActivationLink(
      newUser.email,
      newUser.id,
    );

    newUser.role =
      addUserDto?.secret === this.configService.get('ADMIN_SECRET_KEY')
        ? new Role('admin')
        : new Role('user');

    await this.userRepository.save(newUser);
    return newUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.find({
      relations: { role: true },
      where: { email: email },
    });

    return user[0];
  }
  async getById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async updateProfile(user: UserEditDto) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    const result: UpdateResult = await this.userRepository.update(
      { id: user.id },
      {
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        dateOfBirth: user.dateOfBirth,
      },
    );
    if (result.affected) return;
    if (!result.affected)
      throw new HttpException(
        'User with that id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    else
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }

  async confirmUser(confirmationCode: string) {
    const result = await this.userRepository.update(
      { confirmationCode: confirmationCode },
      { verified: true },
    );
    if (!result.affected)
      throw new HttpException(
        'Wrong confirmation code',
        HttpStatus.BAD_REQUEST,
      );
  }

  addAddress() {}
}
