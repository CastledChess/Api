import { Controller, Get, Logger, Query, Redirect, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomBytes, createHash } from 'crypto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LichessService } from './lichess.service';
import { AuthenticationResponseDto } from '../authentication/dto/response/authentication-response.dto';
import { LichessOAuthConstants } from './constants/lichess-oauth.constants';

/**
 * Contrôleur pour gérer l'authentification via Lichess OAuth
 */
@ApiTags('Authentification Lichess')
@Controller('auth/lichess')
export class LichessController {
  private readonly logger = new Logger(LichessController.name);

  constructor(
    private readonly lichessService: LichessService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Point d'entrée pour initier l'authentification OAuth avec Lichess
   * Redirige l'utilisateur vers Lichess pour autorisation
   */
  @ApiOperation({ summary: 'Initier la connexion Lichess' })
  @ApiResponse({
    status: 302,
    description: "Redirection vers la page d'authentification Lichess",
  })
  @Get('login')
  @Redirect()
  login(@Res({ passthrough: true }) response: Response) {
    try {
      const clientId = this.configService.get<string>('LICHESS_CLIENT_ID');
      const redirectUri = this.configService.get<string>('LICHESS_CALLBACK_URL');

      if (!clientId || !redirectUri) {
        this.logger.error('Configuration Lichess OAuth manquante');
        throw new Error('Configuration Lichess OAuth manquante');
      }

      // Génération du code verifier pour PKCE
      const codeVerifier = this.generateCodeVerifier();

      // Génération du code challenge basé sur le code verifier
      const codeChallenge = this.generateCodeChallenge(codeVerifier);

      // Configuration du cookie sécurisé pour le code verifier
      this.setCodeVerifierCookie(response, codeVerifier);

      // Génération de l'état pour prévenir les attaques CSRF
      const state = randomBytes(16).toString('hex');

      // Construction de l'URL d'autorisation Lichess
      const url = this.buildLichessAuthorizationUrl(clientId, redirectUri, codeChallenge, state);

      return { url, statusCode: 302 };
    } catch (error) {
      this.logger.error(`Erreur lors de l'initialisation de l'authentification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Point d'entrée pour le callback OAuth après autorisation par Lichess
   * Échange le code d'autorisation contre un token d'accès
   */
  @ApiOperation({ summary: "Callback de l'authentification Lichess" })
  @ApiResponse({
    status: 200,
    description: 'Authentification réussie',
    type: AuthenticationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Échec de l'authentification",
  })
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
    @Req() request: Request,
  ): Promise<AuthenticationResponseDto> {
    try {
      // Gestion des erreurs retournées par Lichess
      if (error) {
        this.logger.warn(`Erreur OAuth Lichess: ${error} - ${errorDescription}`);
        throw new UnauthorizedException(`Authentification Lichess: ${errorDescription || error}`);
      }

      if (!code) {
        throw new UnauthorizedException("Code d'autorisation manquant");
      }

      const codeVerifier = request.cookies[LichessOAuthConstants.CODE_VERIFIER_COOKIE];

      if (!codeVerifier) {
        this.logger.warn('Code verifier manquant dans les cookies');
        throw new UnauthorizedException("Session d'authentification expirée ou invalide");
      }

      return this.lichessService.authenticateWithLichess(code, codeVerifier);
    } catch (error) {
      this.logger.error(`Erreur lors du callback d'authentification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Génère un code verifier pour PKCE
   * @returns Le code verifier généré
   */
  private generateCodeVerifier(): string {
    return randomBytes(64).toString('base64url');
  }

  /**
   * Génère un code challenge à partir du code verifier
   * @param codeVerifier Le code verifier
   * @returns Le code challenge
   */
  private generateCodeChallenge(codeVerifier: string): string {
    return createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Configure le cookie pour stocker le code verifier
   * @param response Objet response Express
   * @param codeVerifier Le code verifier à stocker
   */
  private setCodeVerifierCookie(response: Response, codeVerifier: string): void {
    response.cookie(LichessOAuthConstants.CODE_VERIFIER_COOKIE, codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: LichessOAuthConstants.COOKIE_MAX_AGE,
      sameSite: 'lax',
      path: '/api/v1/auth/lichess', // Restriction du chemin pour plus de sécurité
    });
  }

  /**
   * Construit l'URL d'autorisation Lichess
   * @param clientId L'ID client OAuth
   * @param redirectUri L'URI de redirection
   * @param codeChallenge Le code challenge PKCE
   * @param state État pour la protection CSRF
   * @returns L'URL d'autorisation complète
   */
  private buildLichessAuthorizationUrl(
    clientId: string,
    redirectUri: string,
    codeChallenge: string,
    state: string,
  ): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: LichessOAuthConstants.OAUTH_SCOPES.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${LichessOAuthConstants.AUTHORIZATION_URL}?${params.toString()}`;
  }
}
