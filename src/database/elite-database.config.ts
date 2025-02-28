import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_TYPE } from './database.constants';

export const getEliteDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: DATABASE_TYPE,
  url: process.env.ELITE_DATABASE_URL,
  // ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [__dirname + '/../elitedb/entities/*.entity.{js,ts}'],
  // Si on est en production, on ne veut pas synchroniser pour éviter de perdre des données
  synchronize: false,
});
