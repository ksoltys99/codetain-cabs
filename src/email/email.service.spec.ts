import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { mockUserRepository } from '../user/user.repository.mock';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        ConfigService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn((entity) => `${entity.username}${entity.sub}`),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creating verification link', () => {
    it('should return string', async () => {
      const user = mockUserRepository[0];
      const result = await service.createActivationLink(user.email, user.id);
      expect(typeof result).toBe('string');
    });
  });
});
