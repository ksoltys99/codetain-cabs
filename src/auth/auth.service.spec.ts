import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AddUserDto } from '../user/dtos/user.dto';
import { MapsService } from '../maps/maps.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn((entity) => `${entity.username}${entity.sub}`),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendConfirmationMail: jest.fn((entity) => entity),
          },
        },
        {
          provide: UserService,
          useValue: {
            addUser: jest.fn((entity) => entity),
          },
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: MapsService,
          useValue: {
            getGeolocalisation: jest.fn((entity) => entity),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('when calling the getCookieForLogOut method', () => {
    it('should return a correct string', () => {
      const result = authService.getCookieForLogOut();
      expect(result).toBe('Authentication=; HttpOnly; Path=/; Max-Age=0');
    });
  });

  describe('when registering new user', () => {
    const userData: AddUserDto = {
      email: 'test@gmail.com',
      password: 'testpassword',
      name: 'test',
      surname: 'test',
      dateOfBirth: new Date(),
      address: 'test',
    };

    it('should hash the password', async () => {
      const result = await authService.register(userData);
      expect(result.password).not.toBe(userData.password);
    });

    it('should return user with password property equal to undefined', async () => {
      const result = await authService.register(userData);
      expect(result.password).toBe(undefined);
    });
  });
});
