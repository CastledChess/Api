import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { LichessService } from './lichess.service';

@Injectable()
export class LichessStrategy extends PassportStrategy(Strategy, 'lichess') {
  constructor(
    configService: ConfigService,
    private lichessService: LichessService,
  ) {
    super({
      authorizationURL: 'https://lichess.org/oauth',
      tokenURL: 'https://lichess.org/api/token',
      clientID: configService.get<string>('LICHESS_CLIENT_ID'),
      scope: ['email:read', 'preference:read'],
    });
  }

  async validate(accessToken: string): Promise<unknown> {
    const user = await this.lichessService.getUserProfile(accessToken);
    return user;
  }
}
