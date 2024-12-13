import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Move } from './move.entity';
import { AnalysisMoveClassificationEnum } from '../enums/analysis-move-classification.enum';
import { InfoResult } from './info-result.entity';
import { Analysis } from './analysis.entity';
import { CustomBaseEntity } from '../../common/entities/custom-base.entity';

@Entity('analysis_moves')
export class AnalysisMove extends CustomBaseEntity {
  @ManyToOne(() => Move, { cascade: true })
  @JoinColumn({ name: 'move_id' })
  move: Move;

  @Column()
  fen: string;

  @OneToMany(() => InfoResult, (infoResult) => infoResult.analysisMove, {
    cascade: true,
    eager: false, // Chargement sur demande, car les résultats du moteur ne sont pas toujours nécessaires
  })
  engineResults: InfoResult[];

  @Column({
    type: 'enum',
    enum: AnalysisMoveClassificationEnum,
    default: AnalysisMoveClassificationEnum.None,
  })
  classification?: typeof AnalysisMoveClassificationEnum;

  @Column()
  order: number;

  @ManyToOne(() => Analysis, (analysis) => analysis.moves, {
    onDelete: 'CASCADE', // Supprime les coups d'analyse associés lors de la suppression de l'analyse
  })
  @JoinColumn({ name: 'analysis_id' })
  analysis: Analysis;
}
