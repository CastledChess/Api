import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LichessAuthGuard extends AuthGuard('lichess') {}
