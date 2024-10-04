import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONFIG_NAME } from '../common/constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get(DATABASE_CONFIG_NAME),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
