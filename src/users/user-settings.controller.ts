import { Controller, Get, Put, Body, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsDto } from './dto/user-settings.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('Paramètres utilisateur')
@Controller('user/settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UserSettingsController {
  private readonly logger = new Logger(UserSettingsController.name);
  constructor(private readonly settingsService: UserSettingsService) {}

  /**
   * Récupère les paramètres de l'utilisateur connecté
   */
  @Get()
  @ApiOperation({ summary: "Récupération des paramètres de l'utilisateur" })
  getSettings(@CurrentUser() user: User): Promise<UserSettingsDto> {
    return this.settingsService.getSettings(user);
  }

  /**
   * Met à jour les paramètres de l'utilisateur connecté
   */
  @Put()
  @ApiOperation({ summary: "Mise à jour des paramètres de l'utilisateur" })
  @ApiBody({ type: UserSettingsDto })
  @ApiBearerAuth('access-token')
  updateSettings(@CurrentUser() user: User, @Body() updateSettingsDto: UserSettingsDto): Promise<UserSettingsDto> {
    this.logger.debug(
      `Mise à jour des paramètres de l'utilisateur avec l'ID ${user.id}: ${JSON.stringify(updateSettingsDto)}`,
    );
    return this.settingsService.updateSettings(user, updateSettingsDto);
  }
}
