import {
  Controller,
  Get,
  Param,
  ValidationPipe,
  UseGuards,
  NotFoundException,
  Put,
  Patch,
  UsePipes,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { I18nService } from 'nestjs-i18n';
import { UserDto } from 'src/common/dto/user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UpdateUserPasswordDto } from './dto/request/update-user-password.dto';
import { GetUserByEmailDto, GetUserByIdDto } from './dto/request/user-request.dto';

@ApiBearerAuth('access-token')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Récupère les informations de l'utilisateur connecté.
   * |----------------------------------------------------------------------------------------|
   * | ATTENTION : Laisser cette route en premier pour éviter les conflits avec le get(':id') |
   * |----------------------------------------------------------------------------------------|
   * @param user
   */
  @Get('me')
  @ApiOperation({ summary: "Récupérer les informations de l'utilisateur connecté" })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: UserDto })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async getMe(@CurrentUser() user: User): Promise<UserDto> {
    const currentUser = await this.usersService.findOneByIdWithSettings(user.id);
    return new UserDto(currentUser);
  }

  /**
   * Récupère un utilisateur par son identifiant.
   *
   * @throws NotFoundException si l'utilisateur n'est pas trouvé
   * @returns Les informations de l'utilisateur
   * @param getUserByIdDto - Les informations de l'utilisateur à rechercher
   */
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: "UUID de l'utilisateur",
    required: true,
    example: '50749934-714b-450d-9bcf-69e80d489597',
  })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: UserDto })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserById(@Param() getUserByIdDto: GetUserByIdDto): Promise<UserDto> {
    const user = await this.usersService.findOneById(getUserByIdDto.id);
    return new UserDto(user);
  }

  /**
   * Récupère un utilisateur par son email.
   *
   * @throws NotFoundException si l'utilisateur n'est pas trouvé
   * @returns Les informations de l'utilisateur
   * @param getUserByEmailDto - Les informations de l'utilisateur à rechercher
   */
  @Get('email/:email')
  @ApiOperation({ summary: 'Récupérer un utilisateur par email' })
  @ApiParam({
    name: 'email',
    type: String,
    description: "Email de l'utilisateur",
    required: true,
    example: 'user@example.com',
  })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: UserDto })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserByEmail(@Param() getUserByEmailDto: GetUserByEmailDto): Promise<UserDto> {
    const user: User = await this.usersService.findOneByEmail(getUserByEmailDto.email);
    if (!user) {
      throw new NotFoundException(this.i18n.translate('user.errors.notFound'));
    }
    return new UserDto(user);
  }

  @Put('me')
  @ApiOperation({ summary: "Modifier les informations de l'utilisateur connecté" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour', type: UserDto })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 409, description: "Information(s) identique à l'ancienne" })
  async updateUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    const updatedUser = await this.usersService.update(user.id, updateUserDto);
    return new UserDto(updatedUser);
  }

  @Patch('me/password')
  @ApiOperation({ summary: "Modifier le mot de passe de l'utilisateur connecté" })
  @ApiBody({ type: UpdateUserPasswordDto })
  @ApiResponse({ status: 200, description: 'Mot de passe mis à jour', type: UserDto })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 409, description: "Mot de passe identique à l'ancien" })
  async updatePassword(@CurrentUser() user: User, updateUserPasswordDto: UpdateUserPasswordDto): Promise<UserDto> {
    const updatedUser = await this.usersService.updatePassword(user.id, updateUserPasswordDto);
    return new UserDto(updatedUser);
  }
}
