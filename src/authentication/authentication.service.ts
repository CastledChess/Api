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
    const user: User = await this.usersService.findOneByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async refresh(refreshToken: string): Promise<AuthenticationResponseDto> {
    const decoded = this.jwtService.decode(refreshToken) as { email: string };
    const user: User = await this.usersService.findOneByEmail(decoded.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.login(user);
  }

  private generateJwtToken(user: User): string {
    const payload = { email: user.email, sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id, username: user.username };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  private generateLoginResponseDto(accessToken: string, refreshToken: string, user: User): AuthenticationResponseDto {
    const userDto = new UserDto(user);
    return new AuthenticationResponseDto(accessToken, refreshToken, userDto);
  }
}
