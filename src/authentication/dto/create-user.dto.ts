import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @Is
  email: string;

  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'The password of the user', example: 'strongPassword123' })
  @IsString()
  password: string;

//   confirm password
  @ApiProperty({ description: 'The confirm password of the user', example: 'strongPassword123' })
  @IsString()
  confirmPassword: string;
}