import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Connexion de l'utilisateur" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.validateUser(loginDto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: "Inscription de l'utilisateur" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Inscription réussie.' })
  @ApiResponse({ status: 409, description: "L'utilisateur existe déjà." })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
