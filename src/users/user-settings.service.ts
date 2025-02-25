// src/users/settings.service.ts
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from './entities/user-settings.entity';
import { UserSettingsDto } from './dto/user-settings.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);
  constructor(
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
  ) {}

  /**
   * Met à jour les paramètres d'un utilisateur
   * @param user L'utilisateur dont on veut modifier les paramètres
   * @param updateSettingsDto Les nouveaux paramètres
   * @returns Les paramètres mis à jour
   * @throws NotFoundException si les paramètres n'existent pas
   */
  async updateSettings(user: User, updateSettingsDto: UserSettingsDto): Promise<UserSettings> {
    this.logger.debug(
      `Nouveaux paramètres de l'utilisateur avec l'ID ${user.id}: ${JSON.stringify(updateSettingsDto)}`,
    );
    const settings: UserSettings = await this.getSettings(user);

    this.logger.debug(`Mise à jour des paramètres de l'utilisateur avec l'ID ${user.id}`);

    const hasChanges = Object.keys(updateSettingsDto).some((key) => updateSettingsDto[key] !== settings[key]);

    if (!hasChanges) {
      throw new ConflictException('Aucun changement détecté');
    }

    Object.assign(settings, updateSettingsDto);

    return this.settingsRepository.save(settings);
  }

  /**
   * Récupère les paramètres d'un utilisateur
   * @param user L'utilisateur dont on veut récupérer les paramètres
   * @returns Les paramètres de l'utilisateur
   * @throws NotFoundException si les paramètres n'existent pas
   */
  async getSettings(user: User): Promise<UserSettings> {
    const settings: UserSettings = await this.settingsRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!settings) {
      this.logger.error(`Les paramètres de l'utilisateur avec l'ID ${user.id} n'existent pas`);
      throw new NotFoundException("Les paramètres de l'utilisateur n'existent pas");
    }

    this.logger.debug(`Récupération des paramètres de l'utilisateur avec l'ID ${user.id}`);

    return settings;
  }
}
