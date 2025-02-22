import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Move')
export class ElitedbMove {
  @Column()
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
