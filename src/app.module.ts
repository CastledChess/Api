import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nModule } from 'nestjs-i18n';
import { i18nConfig } from './config/i18n.config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Si vous modifiez le fichier .env, vous devrez redémarrer le serveur
      cache: true, // Pour éviter de lire le fichier à chaque fois
      load: [databaseConfig],
    }),
    DatabaseModule,
    I18nModule.forRoot(i18nConfig),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
