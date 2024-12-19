import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovesService } from './moves.service';
import { Move } from 'src/analysis/entities/move.entity';
import { AnalysisMove } from 'src/analysis/entities/analysis-move.entity';
import { InfoResultsModule } from 'src/info-results/info-results.module';

@Module({
  imports: [TypeOrmModule.forFeature([Move, AnalysisMove]), InfoResultsModule],
  providers: [MovesService],
  exports: [MovesService],
})
export class MovesModule {}
