import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LichessStrategyService } from './lichess-strategy.service';
import { Response, Request } from 'express';
import * as crypto from 'crypto';

@Controller('lichess-strategy')
export class LichessStrategyController {
  private readonly frontendUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly lichessStrategyService: LichessStrategyService,
  ) {
    this.frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000/api/v1/');
  }

  private base64URLEncode(str: Buffer): string {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  private sha256(buffer: Buffer): Buffer {
    return crypto.createHash('sha256').update(buffer).digest();
  }

  private createVerifier(): string {
    return this.base64URLEncode(crypto.randomBytes(32));
  }

  private createChallenge(verifier: string): string {
    return this.base64URLEncode(this.sha256(Buffer.from(verifier)));
  }

  @Get('login')
  login(@Req() req: Request, @Res() res: Response) {
    const clientId = this.configService.get('LICHESS_CLIENT_ID');
    const redirectUri = this.configService.get('LICHESS_REDIRECT_URI');

    const codeVerifier = this.createVerifier();
    const codeChallenge = this.createChallenge(codeVerifier);

    req.session['codeVerifier'] = codeVerifier;

    return new Promise((resolve) => {
      req.session.save(() => {
        const scope = 'preference:read';
        const lichessAuthUrl = `https://lichess.org/oauth?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=${scope}`;

        resolve(res.redirect(lichessAuthUrl));
      });
    });
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Req() req: Request, @Res() res: Response) {
    try {
      const clientId = this.configService.get('LICHESS_CLIENT_ID');
      const redirectUri = this.configService.get('LICHESS_REDIRECT_URI');

      console.log('Session complète:', req.session);
      const codeVerifier = req.session['codeVerifier'];
      console.log('Code Verifier from session:', codeVerifier);

      if (!codeVerifier) {
        throw new Error('Code verifier not found in session.');
      }

      const tokenData = await this.lichessStrategyService.getLichessAccessToken(
        'authorization_code',
        code,
        redirectUri,
        clientId,
        codeVerifier,
      );

      const userData = await this.lichessStrategyService.getLichessUser(tokenData.access_token);

      console.log('Session:', req.session);
      console.log('Token Data:', tokenData);

      res.cookie('accessToken', tokenData.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000,
        path: '/',
      });

      req.session['accessToken'] = tokenData.access_token;
      return res.redirect(`${this.frontendUrl}?user=${userData.username}`);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      return res.redirect(`${this.frontendUrl}/lichess-strategy/callback?error=authentication_failed`);
    }
  }
}
