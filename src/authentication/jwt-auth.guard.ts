import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { User } from '../users/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = User>(
    err: Error | null,
    user: TUser | false,
    info: JsonWebTokenError | TokenExpiredError | null,
  ): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired');
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    }

    if (err || !user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
