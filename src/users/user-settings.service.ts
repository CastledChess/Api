// src/users/settings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from './entities/user-settings.entity';
import { UserSettingsDto } from './dto/user-settings.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
  ) {}

  /**
   * Met à jour les paramètres d'un utilisateur
   * @param user L'utilisateur dont on veut modifier les paramètres
   * @param updateSettingsDto Les nouveaux paramètres
   * @returns Les paramètres mis à jour
   */
  async updateSettings(user: User, updateSettingsDto: UserSettingsDto): Promise<UserSettings> {
    const settings = await this.settingsRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!settings) {
      throw new NotFoundException("Les paramètres de l'utilisateur n'existent pas");
    }

    Object.assign(settings, updateSettingsDto);
    return this.settingsRepository.save(settings);
  }

  /**
   * Récupère les paramètres d'un utilisateur
   * @param user L'utilisateur dont on veut récupérer les paramètres
   * @returns Les paramètres de l'utilisateur
   */
  async getSettings(user: User): Promise<UserSettings> {
    const settings = await this.settingsRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!settings) {
      throw new NotFoundException("Les paramètres de l'utilisateur n'existent pas");
    }

    return settings;
  }
}
