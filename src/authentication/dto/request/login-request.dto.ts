import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ description: "L'email de l'utilisateur", example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "Le mot de passe de l'utilisateur", example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
