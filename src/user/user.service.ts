import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { AddUserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private authService: AuthService,
    private emailService: EmailService,
  ) {}
  async addUser(addUserDto: AddUserDto) {
    const newUser = this.userRepository.create(addUserDto);
    newUser.confirmationCode = await this.emailService.createActivationLink(
      newUser.email,
      newUser.id,
    );
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
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
  async updateProfile(user: User) {
    return await this.userRepository.update(
      { id: user.id },
      {
        email: user.email,
        name: user.name,
        surname: user.surname,
      },
    );
  }

  async confirmUser(confirmationCode: string) {
    return this.userRepository.update(
      { confirmationCode: confirmationCode },
      { verified: true },
    );
  }

  async deleteUser(id: number) {
    return this.userRepository.delete({ id: id });
  }
}
