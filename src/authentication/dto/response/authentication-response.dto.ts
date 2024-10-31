import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../common/dto/user.dto';

export class AuthenticationResponseDto {
  @ApiProperty({ description: "Access token de l'utilisateur" })
  accessToken: string;

  @ApiProperty({ description: "Refresh token de l'utilisateur" })
  refreshToken: string;

  @ApiProperty({ description: "Informations de l'utilisateur" })
  user: UserDto;

  constructor(accessToken: string, refreshToken: string, user: UserDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}
