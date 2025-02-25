import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity('Move')
@Index(['position', 'san'], { unique: true })
export class ElitedbMove {
  @PrimaryColumn()
  san: string;

  @PrimaryColumn()
  position: string;

  @Column({ default: 0 })
  white: number;

  @Column({ default: 0 })
  black: number;

  @Column({ default: 0 })
  draw: number;
}
