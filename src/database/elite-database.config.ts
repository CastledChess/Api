import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_TYPE } from './database.constants';

export const getEliteDatabaseConfig = (): TypeOrmModuleOptions => ({
  name: process.env.ELITE_DATABASE_DB,
  type: DATABASE_TYPE,
  url: process.env.ELITE_DATABASE_URL,
  entities: [__dirname + '/../elitedb/*.entity.{js,ts}'],
  // Si on est en production, on ne veut pas synchroniser pour éviter de perdre des données
  synchronize: true,
});
