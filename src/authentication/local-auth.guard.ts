import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/**
 * Garde d'authentification locale utilisant la stratégie 'local'.
 * Elle est utilisée pour protéger les routes en vérifiant les informations de l'utilisateur.
 */
export class LocalAuthGuard extends AuthGuard('local') {}
