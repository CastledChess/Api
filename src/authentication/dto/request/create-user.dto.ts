import { IsString, IsStrongPassword, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  email: string;

  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  username: string;

  @ApiProperty({ description: 'The password of the user', example: 'Password123.' })
  @IsStrongPassword({}, { message: i18nValidationMessage('validation.IS_STRONG_PASSWORD') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  password: string;

  @ApiProperty({ description: 'The confirm password of the user', example: 'Password123.' })
  @IsStrongPassword({}, { message: i18nValidationMessage('validation.IS_STRONG_PASSWORD') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  confirmPassword: string;
}
