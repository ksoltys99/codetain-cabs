import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { AddUserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private authService: AuthService,
    private emailService: EmailService,
  ) {}
  async addUser(addUserDto: AddUserDto) {
    const newUser = this.userRepository.create(addUserDto);
    await this.emailService.sendMail({
      from: 'codetaincabs.service@gmail.com',
      to: newUser.email,
      subject: 'Test',
      text: 'Content',
    });
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
