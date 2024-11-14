import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('moves')
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: ColorType;

  @Column()
  from: SquareType;

  @Column()
  to: SquareType;

  @Column()
  piece: PieceSymbolType;

  @Column({ nullable: true })
  captured?: PieceSymbolType;

  @Column({ nullable: true })
  promotion?: PieceSymbolType;

  @Column()
  flags: string;

  @Column()
  san: string;

  @Column()
  lan: string;

  @Column()
  before: string;

  @Column()
  after: string;
}
