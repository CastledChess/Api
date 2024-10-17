import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import * as packageJson from '../package.json';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  const apiMajorVersion = packageJson.version.split('.')[0];
  // Si la version majeure de l'API est 0, on le définit à 1 sinon on garde la version actuelle
  app.setGlobalPrefix('api/' + (apiMajorVersion === '0' ? 'v1' : 'v' + apiMajorVersion));
  // Ajout de la configuration Swagger à l'application
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(3000);
}
bootstrap().then(() => {});
