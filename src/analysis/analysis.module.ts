import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisMove } from './entities/analysis-move.entity';
import { Analysis } from './entities/analysis.entity';
import { InfoResult } from './entities/info-result.entity';
import { Move } from './entities/move.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Analysis, AnalysisMove, InfoResult, Move])],
  providers: [AnalysisService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
