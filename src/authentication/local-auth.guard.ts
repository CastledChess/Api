import { ExecutionContext, HttpException, HttpStatus, Injectable, ValidationError } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginRequestDto } from './dto/request/login-request.dto';

@Injectable()
/**
 * Garde d'authentification locale utilisant la stratégie 'local'.
 * Elle est utilisée pour protéger les routes en vérifiant les informations de l'utilisateur.
 */
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest<Request>();

    // Transforme le corps de la requête en objet de type LoginRequestDto
    const body: LoginRequestDto = plainToInstance(LoginRequestDto, request.body);

    // Valide les informations de connexion
    const errors: ValidationError[] = await validate(body);

    const errorMessages: string[] = errors.flatMap(({ constraints }: ValidationError): string[] =>
      Object.values(constraints),
    );

    // Si des erreurs sont trouvées, on retourne une erreur 400
    if (errorMessages.length > 0) {
      throw new HttpException(errorMessages, HttpStatus.BAD_REQUEST);
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
