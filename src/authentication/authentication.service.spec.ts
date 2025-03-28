import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { I18nService } from 'nestjs-i18n';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/request/create-user.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { UserDto } from '../common/dto/user.dto';
import { AuthenticationResponseDto } from './dto/response/authentication-response.dto';
import { RefreshTokenRequestDto } from './dto/request/refresh-token-request.dto';
import * as bcrypt from 'bcrypt';
import { UserTypeEnum } from '../users/entities/user-type.enum';

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
// Additional imports needed for the tests

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  /**
   * Utilisateur fictif pour les tests
   */
  const mockUser: User = {
    id: 'user-id-1',
    email: 'test@example.com',
    username: 'test',
    password: 'password',
    analyses: [],
    settings: null,
    accountType: UserTypeEnum.CLASSIC,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  /**
   * Tokens fictifs pour les tests d'authentification
   */
  const mockAccessToken = 'access-token-test';
  const mockRefreshToken = 'refresh-token-test';

  /**
   * Réponse d'authentification fictive
   */
  const mockLoginResponse = new AuthenticationResponseDto(mockAccessToken, mockRefreshToken, new UserDto(mockUser));

  beforeEach(async () => {
    // Configuration des mocks pour les dépendances
    usersService = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      decode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: 'UserRepository',
          useValue: {},
        },
        {
          provide: I18nService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  /**
   * Tests pour la méthode register
   */
  describe('register', () => {
    it('devrait enregistrer un nouvel utilisateur et retourner des tokens', async () => {
      // Arrange
      const createUserDto: CreateUserDto = { ...mockUser, password: 'password123', confirmPassword: 'password123' };

      usersService.create = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(service, 'login').mockResolvedValue(mockLoginResponse);

      // Act
      const result = await service.register(createUserDto);

      // Assert
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(service.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  /**
   * Tests pour la méthode login
   */
  describe('login', () => {
    it('devrait générer des tokens et retourner une réponse de connexion', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn<any, any>(service, 'generateJwtToken').mockReturnValue(mockAccessToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn<any, any>(service, 'generateRefreshToken').mockReturnValue(mockRefreshToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn<any, any>(service, 'generateLoginResponseDto').mockReturnValue(mockLoginResponse);

      // Act
      const result = await service.login(mockUser);

      // Assert
      expect(service['generateJwtToken']).toHaveBeenCalledWith(mockUser);
      expect(service['generateRefreshToken']).toHaveBeenCalledWith(mockUser);
      expect(service['generateLoginResponseDto']).toHaveBeenCalledWith(mockAccessToken, mockRefreshToken, mockUser);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  /**
   * Tests pour la méthode validateUser
   */
  describe('validateUser', () => {
    it('devrait valider les identifiants et retourner un utilisateur', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'test@exemple.com',
        password: 'password123',
      };

      usersService.findOneByEmail = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      // Act
      const result = await service.validateUser(loginDto);

      // Assert
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it("devrait rejeter avec UnauthorizedException si l'utilisateur n'existe pas", async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'inconnu@exemple.com',
        password: 'password123',
      };

      usersService.findOneByEmail = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('devrait rejeter avec UnauthorizedException si le mot de passe est incorrect', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'test@exemple.com',
        password: 'mauvaispassword',
      };

      usersService.findOneByEmail = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      // Act & Assert
      await expect(service.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });
  });

  /**
   * Tests pour la méthode refresh
   */
  describe('refresh', () => {
    it('devrait rafraîchir les tokens avec un refresh token valide', async () => {
      // Arrange
      const decodedToken = { email: 'test@exemple.com' };
      jwtService.decode = jest.fn().mockReturnValue(decodedToken);
      usersService.findOneByEmail = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(service, 'login').mockResolvedValue(mockLoginResponse);

      // Act
      const result = await service.refresh(mockRefreshToken);

      // Assert
      expect(jwtService.decode).toHaveBeenCalledWith(mockRefreshToken);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(decodedToken.email);
      expect(service.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it("devrait rejeter avec UnauthorizedException si l'utilisateur n'existe pas", async () => {
      // Arrange
      const decodedToken = { email: 'inconnu@exemple.com' };
      jwtService.decode = jest.fn().mockReturnValue(decodedToken);
      usersService.findOneByEmail = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.refresh(mockRefreshToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  /**
   * Tests pour les méthodes privées
   */
  describe('méthodes privées', () => {
    describe('generateJwtToken', () => {
      it('devrait générer un token JWT avec les informations utilisateur', () => {
        // Arrange
        jwtService.sign = jest.fn().mockReturnValue(mockAccessToken);

        // Act
        const result = service['generateJwtToken'](mockUser);

        // Assert
        expect(jwtService.sign).toHaveBeenCalledWith({
          email: mockUser.email,
          sub: mockUser.id,
          username: mockUser.username,
        });
        expect(result).toBe(mockAccessToken);
      });
    });

    describe('generateRefreshToken', () => {
      it('devrait générer un refresh token avec expiration de 7 jours', () => {
        // Arrange
        jwtService.sign = jest.fn().mockReturnValue(mockRefreshToken);

        // Act
        const result = service['generateRefreshToken'](mockUser);

        // Assert
        expect(jwtService.sign).toHaveBeenCalledWith(
          {
            email: mockUser.email,
            sub: mockUser.id,
            username: mockUser.username,
          },
          { expiresIn: '7d' },
        );
        expect(result).toBe(mockRefreshToken);
      });
    });

    describe('generateLoginResponseDto', () => {
      it("devrait créer un DTO de réponse d'authentification", () => {
        // Act
        const result = service['generateLoginResponseDto'](mockAccessToken, mockRefreshToken, mockUser);

        // Assert
        expect(result).toBeInstanceOf(AuthenticationResponseDto);
        expect(result.accessToken).toBe(mockAccessToken);
        expect(result.refreshToken).toBe(mockRefreshToken);
        expect(result.user).toBeInstanceOf(UserDto);
        expect(result.user.email).toBe(mockUser.email);
      });
    });
  });
});

/**
 * Tests du Controller d'authentification
 */
describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: Partial<AuthenticationService>;

  /**
   * Utilisateur fictif et réponse d'authentification pour les tests
   */
  const mockUser: User = {
    id: 'user-id-1',
    email: 'test@example.com',
    username: 'test',
    password: 'password',
    analyses: [],
    settings: null,
    accountType: UserTypeEnum.CLASSIC,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockAuthResponse = new AuthenticationResponseDto(
    'access-token-test',
    'refresh-token-test',
    new UserDto(mockUser),
  );

  beforeEach(async () => {
    // Configuration des mocks
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      validateUser: jest.fn(),
      refresh: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Tests pour la méthode login
   */
  describe('login', () => {
    it("devrait connecter un utilisateur et retourner un token d'accès", async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'test@exemple.com',
        password: 'password123',
      };

      authService.validateUser = jest.fn().mockResolvedValue(mockUser);
      authService.login = jest.fn().mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  /**
   * Tests pour la méthode signUp (inscription)
   */
  describe('signUp', () => {
    it('devrait créer un nouvel utilisateur et retourner des tokens', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@exemple.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      authService.register = jest.fn().mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.signUp(createUserDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  /**
   * Tests pour la méthode refresh
   */
  describe('refresh', () => {
    it('devrait rafraîchir les tokens avec un token valide', async () => {
      // Arrange
      const refreshTokenRequest: RefreshTokenRequestDto = {
        refreshToken: 'refresh-token-test',
      };

      authService.refresh = jest.fn().mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.refresh(refreshTokenRequest);

      // Assert
      expect(authService.refresh).toHaveBeenCalledWith(refreshTokenRequest.refreshToken);
      expect(result).toEqual(mockAuthResponse);
    });
  });
});
