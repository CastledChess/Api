import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

/**
 * Décorateur permettant d'accéder à l'utilisateur connecté dans les contrôleurs
 * @example
 * @Get()
 * findOne(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
  const logger = new Logger('CurrentUser');
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    logger.warn('Aucun utilisateur trouvé dans la requête');
    return null;
  }

  logger.debug(`Utilisateur récupéré: ${request.user.email}`);
  return request.user;
});
