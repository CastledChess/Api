import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AnalysisMove } from './analysis-move.entity';

@Entity('info_results')
export class InfoResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'info';

  @Column({ nullable: true })
  depth?: number;

  @Column({ nullable: true })
  selDepth?: number;

  @Column({ nullable: true, type: 'float' })
  eval?: number;

  @Column({ nullable: true })
  centiPawns?: number;

  @Column({ nullable: true, type: 'float' })
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
  analysisMove: AnalysisMove;
}
