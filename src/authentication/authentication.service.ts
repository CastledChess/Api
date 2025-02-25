import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/request/create-user.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../common/dto/user.dto';
import { AuthenticationResponseDto } from './dto/response/authentication-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Crée un nouvel utilisateur et le connecte.
   * @param {CreateUserDto} createUserDto - Les informations de l'utilisateur à créer.
   * @returns {Promise<AuthenticationResponseDto>} L'utilisateur créé.
   * @throws ConflictException Si l'utilisateur existe déjà.
   */
  async register(createUserDto: CreateUserDto): Promise<AuthenticationResponseDto> {
    const user: User = await this.usersService.create(createUserDto);
    return this.login(user);
  }

  /**
   * Connecte un utilisateur.
   * @param {User} user - L'utilisateur à connecter.
   * @returns {Promise<AuthenticationResponseDto>} Un access token.
   * @throws {UnauthorizedException} Si les informations de connexion sont invalides.
   */
  async login(user: User): Promise<AuthenticationResponseDto> {
    const accessToken: string = this.generateJwtToken(user);
    const refreshToken: string = this.generateRefreshToken(user);

    return this.generateLoginResponseDto(accessToken, refreshToken, user);
  }

  /**
   * Vérifie les informations de connexion de l'utilisateur.
   * @param {LoginRequestDto} loginDto - Les informations de connexion.
   * @returns {Promise<User>} L'utilisateur validé.
   * @throws {UnauthorizedException} Si les informations de connexion sont invalides.
   */
  async validateUser(loginDto: LoginRequestDto): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Rafraîchit le token d'accès en utilisant un refresh token.
   * @param {string} refreshToken - Le refresh token.
   * @returns {Promise<AuthenticationResponseDto>} Un nouveau access token.
   * @throws {UnauthorizedException} Si le refresh token est invalide.
   */
  async refresh(refreshToken: string): Promise<AuthenticationResponseDto> {
    const decoded = this.jwtService.decode(refreshToken) as { email: string };
    const user: User = await this.usersService.findOneByEmail(decoded.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.login(user);
  }

  /**
   * Génère un token JWT pour un utilisateur.
   * @param {User} user - L'utilisateur pour lequel générer le token.
   * @returns {string} Le token JWT généré.
   */
  private generateJwtToken(user: User): string {
    const payload = { email: user.email, sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  /**
   * Génère un refresh token pour un utilisateur.
   * @param {User} user - L'utilisateur pour lequel générer le token.
   * @returns {string} Le refresh token généré.
   */
  private generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id, username: user.username };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  /**
   * Génère le DTO de réponse pour une connexion réussie.
   * @param {string} accessToken - L'access token.
   * @param {string} refreshToken - Le refresh token.
   * @param {User} user - L'utilisateur connecté.
   * @returns {AuthenticationResponseDto} Le DTO de réponse de connexion.
   */
  private generateLoginResponseDto(accessToken: string, refreshToken: string, user: User): AuthenticationResponseDto {
    const userDto = new UserDto(user);
    return new AuthenticationResponseDto(accessToken, refreshToken, userDto);
  }
}
