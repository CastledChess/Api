import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { User } from '../users/entities/user.entity';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { AuthenticationResponseDto } from './dto/response/authentication-response.dto';
import { RefreshTokenRequestDto } from './dto/request/refresh-token-request.dto';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { UserDto } from '../common/dto/user.dto';

/**
 * Tests du contrôleur d'authentification
 * Ces tests vérifient que toutes les méthodes du contrôleur
 * fonctionnent correctement et interagissent avec le service
 * d'authentification comme prévu.
 */
describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: jest.Mocked<Partial<AuthenticationService>>;

  /**
   * Données de test pour simuler un utilisateur
   */
  const mockUser: User = {
    id: 'user-123',
    email: 'test@exemple.com',
    username: 'testuser',
    password: 'hashed_password',
  } as User;

  /**
   * Données de test pour simuler une réponse d'authentification
   */
  const mockAuthResponse: AuthenticationResponseDto = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: new UserDto(mockUser),
  } as AuthenticationResponseDto;

  /**
   * Configuration initiale avant chaque test
   */
  beforeEach(async () => {
    // Création des mocks pour le service d'authentification
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      refresh: jest.fn(),
    };

    // Configuration du module de test
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  /**
   * Vérifie que le contrôleur est bien défini
   */
  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Tests de la méthode de connexion
   */
  describe('login', () => {
    it('devrait authentifier un utilisateur et retourner des tokens', async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'test@exemple.com',
        password: 'password123',
      };
      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockAuthResponse);
    });

    it("devrait propager les exceptions du service d'authentification", async () => {
      // Arrange
      const loginDto: LoginRequestDto = {
        email: 'test@exemple.com',
        password: 'wrong_password',
      };
      authService.validateUser.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  /**
   * Tests de la méthode d'inscription
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
      authService.register.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.signUp(createUserDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it("devrait propager les exceptions du service d'inscription", async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@exemple.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };
      authService.register.mockRejectedValue(new ConflictException('User already exists'));

      // Act & Assert
      await expect(controller.signUp(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  /**
   * Tests de la méthode de rafraîchissement de token
   */
  describe('refresh', () => {
    it('devrait rafraîchir les tokens avec un refresh token valide', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenRequestDto = {
        refreshToken: 'valid-refresh-token',
      };
      authService.refresh.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.refresh(refreshTokenDto);

      // Assert
      expect(authService.refresh).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
      expect(result).toEqual(mockAuthResponse);
    });

    it('devrait propager les exceptions du service de rafraîchissement', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenRequestDto = {
        refreshToken: 'invalid-refresh-token',
      };
      authService.refresh.mockRejectedValue(new UnauthorizedException('Invalid token'));

      // Act & Assert
      await expect(controller.refresh(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
