import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserSettings } from '../entities/user-settings.entity';

export class UserSettingsDto {
  @ApiProperty({ description: "La langue de l'utilisateur", example: 'fr' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  language?: string;

  @ApiProperty({ description: "Le thème de l'interface", example: 'dark' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  theme?: string;

  @ApiProperty({ description: 'Mode sombre', example: true })
  @IsOptional()
  darkMode?: boolean;

  constructor(settings: UserSettings) {
    this.language = settings.language;
    this.theme = settings.theme;
    this.darkMode = settings.darkMode;
  }
}
