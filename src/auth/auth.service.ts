import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { AddUserDto } from '../user/dtos/user.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './tokenPayload.interface';
import { EmailService } from '../email/email.service';
import { MapsService } from '../maps/maps.service';
import { JourneyService } from '../journey/journey.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private mapsService: MapsService,
    private journeyService: JourneyService,
  ) {}

  public async register(registrationData: AddUserDto) {
    const userCoords = await this.mapsService.getGeolocalisation(
      registrationData.address.city,
    );
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userService.addUser({
        ...registrationData,
        password: hashedPassword,
        addressWithCoords: {
          city: registrationData.address.city,
          postalCode: registrationData.address.postalCode,
          street: registrationData.address.street,
          building: registrationData.address.building,
          coordsLat: userCoords.lat,
          coordsLng: userCoords.lng,
          zone: await this.journeyService.getZone(
            registrationData.address.postalCode.substring(0, 2),
          ),
        },
      });

      createdUser.password = undefined;

      await this.emailService.sendConfirmationMail(createdUser);

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

  public getCookieWithJwtToken(
    userId: number,
    username: string,
    userRole: string,
  ) {
    const payload: TokenPayload = { userId, username, userRole };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
