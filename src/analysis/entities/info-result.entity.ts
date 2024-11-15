import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AnalysisMove } from './analysis-move.entity';
import { CustomBaseEntity } from '../../common/entities/custom-base.entity';

@Entity('info_results')
export class InfoResult extends CustomBaseEntity {
  @Column()
  type: 'info';

  @Column({ nullable: true })
  depth?: number;

  @Column({ nullable: true, name: 'sel_depth' })
  selDepth?: number;

  @Column({ nullable: true, type: 'float' })
  eval?: number;

  @Column({ nullable: true, name: 'centi_pawns' })
  centiPawns?: number;

  @Column({ nullable: true, type: 'float', name: 'win_chance' })
  winChance?: number;

  @Column({ nullable: true, type: 'float' })
  mate?: number;

  @Column({ nullable: true })
  move?: string;

  @Column({ nullable: true })
  from?: string;

  @Column({ nullable: true })
  to?: string;

  @Column('simple-array')
  pv: string[];

  @ManyToOne(() => AnalysisMove, (analysisMove) => analysisMove.engineResults)
  @JoinColumn({ name: 'analysis_move_id' })
  analysisMove: AnalysisMove;
}
