import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { Entity, Column } from 'typeorm';

@Entity('elitedb-moves')
export class ElitedbMove extends CustomBaseEntity {
  @Column()
  san: string;

  @Column()
  position: string;

  @Column({ default: 0 })
  white: number;

  @Column({ default: 0 })
  black: number;

  @Column({ default: 0 })
  draw: number;
}
