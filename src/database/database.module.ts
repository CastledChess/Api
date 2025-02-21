import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './database.config';
import { getEliteDatabaseConfig } from './elite-database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => getDatabaseConfig(),
      inject: [ConfigService],
      name: 'default',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => getEliteDatabaseConfig(),
      inject: [ConfigService],
      name: 'elitedb',
    }),
  ],
})
export class DatabaseModule {}
