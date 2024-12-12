import { Controller, Get, Param, ParseUUIDPipe, ValidationPipe, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { I18nService } from 'nestjs-i18n';
import { UserDto } from 'src/common/dto/user.dto';
import { GetUserByEmailDto, GetUserByIdDto } from './dto/request/user-request.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('Utilisateurs')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Récupère un utilisateur par son identifiant.
   *
   * @param id - L'identifiant UUID de l'utilisateur
   * @throws NotFoundException si l'utilisateur n'est pas trouvé
   * @returns Les informations de l'utilisateur
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
  async getUserById(@Param('id', ParseUUIDPipe) { id }: GetUserByIdDto): Promise<UserDto> {
    const user = await this.usersService.findOneById(id);
    return new UserDto(user);
  }

  /**
   * Récupère un utilisateur par son email.
   *
   * @param email - L'adresse email de l'utilisateur
   * @throws NotFoundException si l'utilisateur n'est pas trouvé
   * @returns Les informations de l'utilisateur
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
  async getUserByEmail(
    @Param(new ValidationPipe({ transform: true }))
    { email }: GetUserByEmailDto,
  ): Promise<UserDto> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(this.i18n.translate('user.errors.notFound'));
    }
    return new UserDto(user);
  }

  @Get('me')
  @ApiOperation({ summary: "Récupérer les informations de l'utilisateur connecté" })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: UserDto })
  @ApiBearerAuth('access-token')
  async getMe(@CurrentUser() user: User): Promise<UserDto> {
    const currentUser = await this.usersService.findOneByIdWithSettings(user.id);
    return new UserDto(currentUser);
  }
}
