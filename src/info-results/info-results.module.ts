import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfoResultsService } from './info-results.service';
import { InfoResult } from 'src/analysis/entities/info-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InfoResult])],
  providers: [InfoResultsService],
  exports: [InfoResultsService],
})
export class InfoResultsModule {}
