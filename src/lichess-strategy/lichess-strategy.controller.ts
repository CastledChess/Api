import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LichessStrategyService } from './lichess-strategy.service';
import { Response } from 'express';

@Controller('lichess-strategy')
export class LichessStrategyController {
  constructor(
    private readonly configService: ConfigService,
    private readonly lichessStrategyService: LichessStrategyService,
  ) {}

  @Get('login')
  login(@Res() res: Response) {
    const clientId = this.configService.get('LICHESS_CLIENT_ID');
    const redirectUri = this.configService.get('LICHESS_REDIRECT_URI');
    const codeChallenge = this.configService.get('LICHESS_CODE_CHALLENGE');
    const lichessAuthUrl = `https://lichess.org/oauth?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    return res.redirect(lichessAuthUrl);
  }

  @Get('logout')
  async logout(@Query('token') token: string, @Res() res: Response) {
    try {
      const isRevoked = await this.lichessStrategyService.revokeLichessAccessToken(token);
      if (isRevoked) {
        res.redirect('http://localhost:3000?logout=true');
      } else {
        res.redirect('http://localhost:3000?error=logout_failed');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      res.redirect('http://localhost:3000?error=logout_failed');
    }
  }

  @Get('callback')
  async callback(
    @Query('grant_type') grantType: string,
    @Query('code') code: string,
    @Query('code_verifier') codeVerifier: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('client_id') clientId: string,
    @Res() res: Response,
  ) {
    try {
      const accessToken = await this.lichessStrategyService.getLichessAccessToken(
        grantType,
        code,
        redirectUri,
        clientId,
        codeVerifier,
      );

      const redUri = `http://localhost:3000/api/v1`;

      return res.redirect(`${redUri}?token=${accessToken}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return res.redirect(`${redirectUri}?error=authentication_failed`);
    }
  }
}
