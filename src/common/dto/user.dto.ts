import { ApiProperty } from '@nestjs/swagger';
import { UserSettingsDto } from '../../users/dto/user-settings.dto';
import { User } from 'src/users/entities/user.entity';

export class UserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ type: () => UserSettingsDto })
  settings: UserSettingsDto;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.settings = user.settings ? new UserSettingsDto(user.settings) : null;
  }
}
