import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Move } from './move.entity';
import { AnalysisMoveClassificationEnum } from '../enums/analysis-move-classification.enum';
import { InfoResult } from './info-result.entity';
import { Analysis } from './analysis.entity';

@Entity('analysis_moves')
export class AnalysisMove {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Move, { cascade: true })
  move: Move;

  @Column()
  fen: string;

  @OneToMany(() => InfoResult, (infoResult) => infoResult.analysisMove, {
    cascade: true,
  })
  engineResults: InfoResult[];

  @Column({
    type: 'enum',
    enum: AnalysisMoveClassificationEnum,
    default: AnalysisMoveClassificationEnum.None,
  })
  classification?: AnalysisMoveClassificationEnum;

  @ManyToOne(() => Analysis, (analysis) => analysis.moves)
  analysis: Analysis;
}
