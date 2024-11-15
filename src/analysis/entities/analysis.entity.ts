import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AnalysisMove } from './analysis-move.entity';
import { CustomBaseEntity } from '../../common/entities/custom-base.entity';
import { User } from '../../users/user.entity';

@Entity('analysis')
@Unique(['pgn', 'user'])
@Index(['pgn', 'user'])
export class Analysis extends CustomBaseEntity {
  @Column()
  pgn: string;

  @Column()
  variants: number;

  @Column('jsonb')
  header: Record<string, string>;

  @OneToMany(() => AnalysisMove, (analysisMove) => analysisMove.analysis, {
    cascade: true,
  })
  @JoinColumn({ name: 'move_id' })
  moves: AnalysisMove[];

  @ManyToOne(() => User, (user) => user.analyses, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
