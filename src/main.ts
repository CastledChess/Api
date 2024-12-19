import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import * as packageJson from '../package.json';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter(), new I18nValidationExceptionFilter());
  app.useGlobalPipes(
    new I18nValidationPipe(),
    new ValidationPipe({
      whitelist: true, // Ignore les propriétés qui ne sont pas dans le DTO
      transform: true, // Transforme les types automatiquement
    }),
  );
  app.enableCors();
  app.use(json({ limit: '1mb' }));
  const apiMajorVersion = packageJson.version.split('.')[0];
  // Si la version majeure de l'API est 0, on le définit à 1 sinon on garde la version actuelle
  app.setGlobalPrefix('api/' + (apiMajorVersion === '0' ? 'v1' : 'v' + apiMajorVersion));
  // Ajout de la configuration Swagger à l'application

  if (process.env.NODE_ENV === 'development') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(3000);
}

bootstrap().then(() => {});
