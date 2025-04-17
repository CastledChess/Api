/**
 * Constantes liées à l'authentification OAuth de Lichess
 */
export class LichessOAuthConstants {
  /**
   * URL de base pour l'autorisation OAuth
   */
  static readonly AUTHORIZATION_URL = 'https://lichess.org/oauth';

  /**
   * URL de base pour l'API
   */
  static readonly API_URL = 'https://lichess.org/api';

  /**
   * URL pour l'obtention des tokens
   */
  static readonly TOKEN_URL = 'https://lichess.org/api/token';

  /**
   * Nom du cookie stockant le code verifier
   */
  static readonly CODE_VERIFIER_COOKIE = 'lichess_code_verifier';

  /**
   * Durée de vie du cookie en millisecondes (10 minutes)
   */
  static readonly COOKIE_MAX_AGE = 10 * 60 * 1000;

  /**
   * Scopes d'autorisation demandés
   */
  static readonly OAUTH_SCOPES = ['email:read', 'preference:read'];
}
