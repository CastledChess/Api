import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { CreateUserDto } from './dto/request/create-user.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../common/dto/user.dto';
import { AuthenticationResponseDto } from './dto/response/authentication-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  private readonly lichessToken: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.lichessToken = this.configService.get<string>('LICHESS_TOKEN');
  }

  /**
   * Crée un nouvel utilisateur et le connecte.
   * @param createUserDto les informations de l'utilisateur à créer.
   * @returns l'utilisateur créé.
   * @throws ConflictException si l'utilisateur existe déjà.
   */
  async register(createUserDto: CreateUserDto): Promise<AuthenticationResponseDto> {
    const user: User = await this.usersService.create(createUserDto);
    return this.login(user);
  }

  /**
   * Connecte un utilisateur.
   * @param user l'utilisateur à connecter.
   * @returns un access token.
   * @throws UnauthorizedException si les informations de connexion sont invalides.
   */
  async login(user: User): Promise<AuthenticationResponseDto> {
    const accessToken: string = this.generateJwtToken(user);
    const refreshToken: string = this.generateRefreshToken(user);

    return this.generateLoginResponseDto(accessToken, refreshToken, user);
  }

  async validateUser(loginDto: LoginRequestDto): Promise<User> {
    const user: User = await this.usersService.findOne(loginDto.email);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private generateJwtToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  private generateUserDto(user: User): UserDto {
    return new UserDto(user.id.toString(), user.email, user.username);
  }

  private generateLoginResponseDto(accessToken: string, refreshToken: string, user: User): AuthenticationResponseDto {
    return new AuthenticationResponseDto(accessToken, refreshToken, this.generateUserDto(user));
  }

  /**
   * Connecte un utilisateur avec Lichess.
   * @returns Les informations de l'utilisateur sur Lichess.
   * @throws UnauthorizedException si les informations de connexion sont invalides.
   */
  async lichessLogin(): Promise<User> {
    if (!this.lichessToken) {
      throw new UnauthorizedException('Le token Lichess est manquant');
    }

    try {
      const headers = {
        Authorization: `Bearer ${this.lichessToken}`,
      };

      const response = await this.httpService.get('https://lichess.org/api/account', { headers }).toPromise();

      return response.data;
    } catch (error) {
      throw new UnauthorizedException("Erreur d'authentification avec Lichess", error.message);
    }
  }
}
