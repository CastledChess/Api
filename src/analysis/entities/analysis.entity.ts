import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AnalysisMove } from './analysis-move.entity';

@Entity('analysis')
@Unique(['pgn'])
@Index(['pgn'])
export class Analysis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pgn: string;

  @Column()
  variants: number;

  @Column('jsonb')
  header: Record<string, string>;

  @OneToMany(() => AnalysisMove, (analysisMove) => analysisMove.analysis, {
    cascade: true,
  })
  moves: AnalysisMove[];
}
