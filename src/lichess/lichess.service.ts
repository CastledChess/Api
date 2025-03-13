import { Injectable, Logger, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, catchError, throwError } from 'rxjs';
import { LichessUserInterface } from './interfaces/lichess-user.interface';
import { LichessTokenInterface } from './interfaces/lichess-token.interface';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthenticationResponseDto } from '../authentication/dto/response/authentication-response.dto';
import { LichessOAuthConstants } from './constants/lichess-oauth.constants';
import { randomBytes } from 'crypto';
import { UserTypeEnum } from 'src/users/entities/user-type.enum';

/**
 * Service gérant l'interaction avec l'API Lichess
 */
@Injectable()
export class LichessService {
  private readonly logger = new Logger(LichessService.name);

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthenticationService,
  ) {}

  /**
   * Échange un code d'autorisation contre un token d'accès Lichess
   *
   * @param code Le code d'autorisation reçu de Lichess
   * @param codeVerifier Le code verifier PKCE généré précédemment
   * @returns Le token d'accès
   * @throws UnauthorizedException si l'échange échoue
   */
  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<LichessTokenInterface> {
    try {
      const clientId = this.configService.get<string>('LICHESS_CLIENT_ID');
      const redirectUri = this.configService.get<string>('LICHESS_CALLBACK_URL');

      if (!clientId || !redirectUri) {
        throw new InternalServerErrorException('Configuration OAuth Lichess incomplète');
      }

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      });

      const response$ = this.http
        .post<LichessTokenInterface>(LichessOAuthConstants.TOKEN_URL, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(clientId).toString('base64')}`,
          },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(
              `Erreur lors de l'échange du code: ${error.response?.data?.error || error.message}`,
              error.stack,
            );
            return throwError(() => new UnauthorizedException("Échec de l'authentification avec Lichess"));
          }),
        );

      const { data } = await lastValueFrom(response$);
      return data;
    } catch (error) {
      this.logger.error(`Erreur lors de l'échange du code: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère le profil de l'utilisateur Lichess authentifié
   *
   * @param accessToken Le token d'accès Lichess
   * @returns Le profil utilisateur
   * @throws UnauthorizedException si la récupération échoue
   */
  async getUserProfile(accessToken: string): Promise<LichessUserInterface> {
    try {
      const response$ = this.http
        .get<LichessUserInterface>(`${LichessOAuthConstants.API_URL}/account`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(
              `Erreur lors de la récupération du profil: ${error.response?.data?.error || error.message}`,
              error.stack,
            );
            return throwError(() => new UnauthorizedException('Impossible de récupérer le profil Lichess'));
          }),
        );

      const { data } = await lastValueFrom(response$);
      return data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération du profil: ${error.message}`);
      throw error;
    }
  }

  /**
   * Authentifie un utilisateur avec Lichess et retourne un token JWT
   *
   * @param code Code d'autorisation Lichess
   * @param codeVerifier Code verifier PKCE pour la sécurité
   * @returns Token JWT pour l'authentification dans notre application
   * @throws UnauthorizedException si l'authentification échoue
   */
  async authenticateWithLichess(code: string, codeVerifier: string): Promise<AuthenticationResponseDto> {
    try {
      // 1. Échanger le code contre un token
      const lichessToken = await this.exchangeCodeForToken(code, codeVerifier);

      // 2. Récupérer les informations de l'utilisateur
      const lichessUser = await this.getUserProfile(lichessToken.access_token);

      if (!lichessUser || !lichessUser.id || !lichessUser.username) {
        throw new UnauthorizedException('Profil utilisateur Lichess incomplet');
      }

      // 3. Trouver ou créer l'utilisateur dans notre base de données
      const lichessEmail = `${lichessUser.id}@lichess.org`;
      let user = await this.usersService.findOneByEmail(lichessEmail);

      if (!user) {
        user = await this.createUserFromLichessProfile(lichessUser, lichessEmail);
        this.logger.log(`Nouvel utilisateur Lichess créé: ${lichessUser.username}`);
      } else {
        this.logger.log(`Utilisateur Lichess existant connecté: ${lichessUser.username}`);
      }

      // 4. Générer un token JWT pour notre application
      return this.authService.login(user);
    } catch (error) {
      this.logger.error(`Échec d'authentification Lichess: ${error.message}`);
      throw error;
    }
  }

  /**
   * Crée un nouvel utilisateur à partir d'un profil Lichess
   *
   * @param lichessUser Le profil utilisateur Lichess
   * @param email L'email généré pour l'utilisateur
   * @returns L'utilisateur créé
   */
  private async createUserFromLichessProfile(lichessUser: LichessUserInterface, email: string) {
    // Générer un mot de passe aléatoire sécurisé
    const randomPassword = randomBytes(32).toString('hex');

    return this.usersService.create(
      {
        email,
        username: lichessUser.username,
        password: randomPassword,
        confirmPassword: randomPassword,
      },
      UserTypeEnum.LICHESS,
    );
  }
}
