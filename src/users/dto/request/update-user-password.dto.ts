import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserPasswordDto {
  @ApiProperty({ description: 'The current password of the user', example: 'Password123.' })
  @IsStrongPassword({}, { message: i18nValidationMessage('validation.IS_STRONG_PASSWORD') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  currentPassword: string;

  @ApiProperty({ description: 'The password of the user', example: 'Password123.' })
  @IsStrongPassword({}, { message: i18nValidationMessage('validation.IS_STRONG_PASSWORD') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  password: string;

  @ApiProperty({ description: 'The confirm password of the user', example: 'Password123.' })
  @IsStrongPassword({}, { message: i18nValidationMessage('validation.IS_STRONG_PASSWORD') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  confirmPassword: string;
}
