import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

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

  constructor(settings: Partial<UserSettingsDto>) {
    Object.assign(this, settings);
  }
}
