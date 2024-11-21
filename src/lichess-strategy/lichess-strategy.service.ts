import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LichessStrategyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getLichessAccessToken(
    grantType: string,
    code: string,
    redirectUri: string,
    clientId: string,
    codeVerifier: string,
  ): Promise<string> {
    const response$ = await this.httpService.post('https://lichess.org/api/token', {
      grant_type: grantType,
      code: code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
      client_id: clientId,
    });

    const response = await lastValueFrom(response$);
    return response.data.access_token;
  }

  async revokeLichessAccessToken(token: string): Promise<boolean> {
    try {
      const response$ = this.httpService.delete('https://lichess.org/api/token', {
        headers: { Authorization: `Bearer ${token}` },
      });

      await lastValueFrom(response$);
      return true;
    } catch (error) {
      console.error('Erreur lors de la révocation du token Lichess:', error);
      throw new HttpException('Echec de révocation du Token', HttpStatus.BAD_REQUEST);
    }
  }
}
