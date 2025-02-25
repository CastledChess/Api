import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_TYPE } from './database.constants';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.{js,ts}', '!' + __dirname + '/../elitedb/**/*.entity.{js,ts}'],
  synchronize: true,
});
