import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovesService } from './moves.service';
import { Move } from '../analysis/entities/move.entity';
import { AnalysisMove } from '../analysis/entities/analysis-move.entity';
import { InfoResultsModule } from '../info-results/info-results.module';

@Module({
  imports: [TypeOrmModule.forFeature([Move, AnalysisMove]), InfoResultsModule],
  providers: [MovesService],
  exports: [MovesService],
})
export class MovesModule {}
