import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../common/dto/user.dto';

export class AuthenticationResponseDto {
  @ApiProperty({ description: "Access token de l'utilisateur" })
  access_token: string;

  @ApiProperty({ description: "Refresh token de l'utilisateur" })
  refresh_token: string;

  @ApiProperty({ description: "Informations de l'utilisateur" })
  user: UserDto;

  constructor(access_token: string, refresh_token: string, user: UserDto) {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.user = user;
  }
}
