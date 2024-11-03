import { DocumentBuilder } from '@nestjs/swagger';
import * as packageJson from '../../package.json';

export const swaggerConfig = new DocumentBuilder()
  .setTitle(packageJson.name)
  .setDescription(packageJson.description)
  .setVersion(packageJson.version)
  .build();
