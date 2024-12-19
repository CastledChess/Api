import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  /**
   * Le token de rafraîchissement.
   */
  @ApiProperty({
    description: 'Le token de rafraîchissement',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbGljaWV1eEBjYWNhLm1pYW0iLCJzdWIiOiJkMDkzYmIzMS00ZTUzLTQ4MmItODQ0NC1jOWIwZTRhODE5ZTUiLCJ1c2VybmFtZSI6Imdyb3NfY2FjYV9ib3VkaW4iLCJpYXQiOjE3MzM5OTcyNjksImV4cCI6MTczNDYwMjA2OX0.6mACZqgy7foW3MyRbvAWyu1rrtU6_xbYxgmtyAX-zSA',
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  refreshToken: string;
}
