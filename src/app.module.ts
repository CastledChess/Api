import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nModule } from 'nestjs-i18n';
import { i18nConfig } from './i18n/i18n.config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AnalysisModule } from './analysis/analysis.module';
import { MovesModule } from './moves/moves.module';
import { InfoResultsModule } from './info-results/info-results.module';
import { ChessModule } from './chess/chess.module';
import { ElitedbModule } from './elitedb/elitedb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Si vous modifiez le fichier .env, vous devrez redémarrer le serveur
      cache: true, // Pour éviter de lire le fichier à chaque fois
      expandVariables: true, // Pour utiliser les variables d'environnement dans le fichier .env
    }),
    DatabaseModule,
    I18nModule.forRoot(i18nConfig),
    AuthenticationModule,
    UsersModule,
    AnalysisModule,
    InfoResultsModule,
    MovesModule,
    ChessModule,
    ElitedbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
