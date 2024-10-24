import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginRequestDto {
  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.isEmail') })
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'password123' })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  password: string;
}
