import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { I18nService } from 'nestjs-i18n';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: 'UserRepository',
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked-token'), // Mock the get method
          },
        },
        {
          provide: I18nService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
