import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto {
  @ApiProperty({ description: "L'email de l'utilisateur", example: 'user@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  username?: string;
}
