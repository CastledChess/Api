import { ApiProperty } from '@nestjs/swagger';
import { UserSettingsDto } from '../../users/dto/user-settings.dto';
import { User } from 'src/users/entities/user.entity';
import { UserTypeEnum } from 'src/users/entities/user-type.enum';

export class UserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ type: () => UserSettingsDto })
  settings: UserSettingsDto;

  @ApiProperty({ enum: UserTypeEnum, example: UserTypeEnum.CLASSIC })
  accountType: UserTypeEnum;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.settings = user.settings ? new UserSettingsDto(user.settings) : undefined;
    this.accountType = user.accountType;
  }
}
