import { Test, TestingModule } from '@nestjs/testing';
import { AdministrationService } from './administration.service';
import { EmailService } from '../email/email.service';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from '../shared/address.entity';

describe('AdministrationService', () => {
  let service: AdministrationService;
  let repositoryMock: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdministrationService,
        {
          provide: EmailService,
          useValue: {
            sendConfirmationMail: jest.fn((entity) => entity),
            sendDeletionMail: jest.fn((entity) => entity),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
            clear: jest.fn((entity) => entity),
          },
        },
        {
          provide: getRepositoryToken(Address),
          useValue: {
            find: jest.fn((entity) => entity),
            delete: jest.fn((entity) => entity),
            clear: jest.fn((entity) => entity),
          },
        },
      ],
    }).compile();

    service = module.get<AdministrationService>(AdministrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
