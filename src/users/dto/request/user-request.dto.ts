import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserByEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: "Email de l'utilisateur",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class GetUserByIdDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: "UUID de l'utilisateur",
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
