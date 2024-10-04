import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_CONFIG_NAME, DATABASE_TYPE } from '../common/constants';

export default registerAs(
  DATABASE_CONFIG_NAME,
  (): TypeOrmModuleOptions => ({
    type: DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    // Si on est en production, on ne veut pas synchroniser pour éviter de perdre des données
    synchronize: process.env.NODE_ENV === 'development',
  }),
);
