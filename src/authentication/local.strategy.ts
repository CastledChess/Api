import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({ usernameField: 'email' });
  }

  /**
   * Cette méthode est appelée par Passport pour valider les informations d'identification de l'utilisateur.
   * @param email l'email de l'utilisateur
   * @param password le mot de passe de l'utilisateur
   * @returns l'utilisateur si les informations d'identification sont valides
   * @throws UnauthorizedException si les informations de connexion sont invalides
   */
  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
