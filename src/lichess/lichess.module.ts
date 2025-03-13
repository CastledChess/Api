import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { LichessController } from './lichess.controller';
import { LichessService } from './lichess.service';
import { LichessStrategy } from './lichess.strategy';
import { UsersModule } from '../users/users.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'lichess' }),
    HttpModule,
    ConfigModule,
    UsersModule,
    AuthenticationModule,
  ],
  controllers: [LichessController],
  providers: [LichessService, LichessStrategy],
  exports: [LichessService],
})
export class LichessModule {}
