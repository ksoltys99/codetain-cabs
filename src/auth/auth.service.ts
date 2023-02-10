import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { AddUserDto } from 'src/user/user.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(registrationData: AddUserDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userService.addUser({
        ...registrationData,
        password: hashedPassword,
      });

      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(email: string, pd: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user && (await bcrypt.compare(pd, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
