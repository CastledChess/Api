import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticationResponseDto } from './dto/response/authentication-response.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  /**
   * Connecte un utilisateur.
   * @param loginDto les informations de connexion de l'utilisateur.
   * @returns un access token.
   * @throws UnauthorizedException si les informations de connexion sont invalides.
   */
  @ApiOperation({ summary: "Connexion de l'utilisateur" })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthenticationResponseDto> {
    const user: User = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  /**
   * Crée un nouvel utilisateur.
   * @param createUserDto les informations de l'utilisateur à créer.
   * @returns l'utilisateur créé.
   * @throws ConflictException si l'utilisateur existe déjà.
   */
  @ApiOperation({ summary: "Inscription de l'utilisateur" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Inscription réussie.' })
  @ApiResponse({ status: 409, description: "L'utilisateur existe déjà." })
  @Post('register')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<AuthenticationResponseDto> {
    return this.authService.register(createUserDto);
  }

  /**
   * Connecte un utilisateur via Lichess.
   * @returns Les informations de l'utilisateur sur Lichess.
   * @throws UnauthorizedException si le token est manquant ou invalide.
   */
  @ApiOperation({ summary: 'Connexion via Lichess' })
  @ApiResponse({ status: 200, description: 'Connexion réussie avec Lichess.' })
  @ApiResponse({ status: 401, description: "Erreur d'authentification avec Lichess." })
  @Post('lichess/login')
  async lichessLogin(): Promise<User> {
    return this.authService.lichessLogin();
  }
}
