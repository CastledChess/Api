import { IsString, IsStrongPassword, IsDefined, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({ description: 'The password of the user', example: 'password123' })
  @IsStrongPassword({}, { message: i18nValidationMessage('validation.INVALID_PASSWORD') })
  @IsDefined()
  password: string;

  @ApiProperty({ description: 'The confirm password of the user', example: 'password123' })
  @IsStrongPassword({}, { message: i18nValidationMessage('validation.INVALID_PASSWORD') })
  @IsDefined()
  confirmPassword: string;
}
