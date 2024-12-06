import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_TYPE } from './database.constants';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // Si on est en production, on ne veut pas synchroniser pour éviter de perdre des données
  synchronize: process.env.NODE_ENV === 'development',
});
