import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  constructor(private readonly settingsService: UserSettingsService) {}

  /**
   * Récupère les paramètres de l'utilisateur connecté
   */
  @Get()
  @ApiOperation({ summary: "Récupération des paramètres de l'utilisateur" })
  getSettings(@CurrentUser() user: User) {
    return this.settingsService.getSettings(user);
  }

  /**
   * Met à jour les paramètres de l'utilisateur connecté
   */
  @Put()
  @ApiOperation({ summary: "Mise à jour des paramètres de l'utilisateur" })
  updateSettings(@CurrentUser() user: User, @Body() updateSettingsDto: UserSettingsDto) {
    return this.settingsService.updateSettings(user, updateSettingsDto);
  }
}
