import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { AddUserDto } from './dtos/user.dto';
import { EmailService } from '../email/email.service';
import { mockUserRepository } from './user.repository.mock';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn((entity) => entity),
            save: jest.fn((entity) => entity),
            findOneBy: jest.fn((entity) => {
              if (entity.email == 'testmail1@gmail.com')
                return mockUserRepository[0];
              return null;
            }),
            update: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
          },
        },
        {
          provide: EmailService,
          useValue: {
            createActivationLink: jest.fn(() => 'activation_link'),
            sendMail: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    mockRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('When creating new user', () => {
    const mockUser: AddUserDto = {
      email: 'testmail@gmail.com',
      password: 'testpassword123',
      name: 'testname',
      surname: 'testsurname',
      dateOfBirth: new Date('19:01:2000T00:00:01'),
      address: 'testaddress',
    };

    it('should not change user data', async () => {
      const result = await userService.addUser(mockUser);
      expect(result.name).toBe(mockUser.name);
      expect(result.email).toBe(mockUser.email);
      expect(result.surname).toBe(mockUser.surname);
    });

    it('should add confirmationCode property to user', async () => {
      const result = await userService.addUser(mockUser);
      expect(result).toHaveProperty('confirmationCode');
      expect(result.confirmationCode).toBe('activation_link');
    });
  });

  describe('When looking for user by email', () => {
    let correctMail = 'testmail1@gmail.com';
    let wrongEmail = 'somewrongmail@gmail';

    it('should return user if it is found', async () => {
      const result = await userService.getUserByEmail(correctMail);
      expect(result.email).toBe(correctMail);
    });

    it('should return null if user is not found', async () => {
      const result = await userService.getUserByEmail(wrongEmail);
      expect(result).toBe(null);
    });
  });

  describe('When confirming user account', () => {
    let confirmationCode = '123';

    it('should throw http exception if code is wrong', async () => {
      try {
        await userService.confirmUser(confirmationCode);
      } catch (e) {
        expect(e.message).toBe('Wrong confirmation code');
      }
    });
  });
});
