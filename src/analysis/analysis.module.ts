import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisMove } from './entities/analysis-move.entity';
import { Analysis } from './entities/analysis.entity';
import { InfoResult } from './entities/info-result.entity';
import { Move } from './entities/move.entity';
import { MovesService } from 'src/moves/moves.service';
import { InfoResultsService } from 'src/info-results/info-results.service';

@Module({
  imports: [TypeOrmModule.forFeature([Analysis, AnalysisMove, InfoResult, Move])],
  providers: [AnalysisService, MovesService, InfoResultsService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
