import { Column, Entity } from 'typeorm';
import { SquareEnum } from '../enums/square.enum';
import { PieceSymbolEnum } from '../enums/piece-symbol.enum';
import { ColorEnum } from '../enums/color.enum';
import { CustomBaseEntity } from '../../common/entities/custom-base.entity';

@Entity('moves')
export class Move extends CustomBaseEntity {
  @Column({
    type: 'enum',
    enum: ColorEnum,
  })
  color: ColorEnum;

  @Column({
    type: 'enum',
    enum: SquareEnum,
  })
  from: SquareEnum;

  @Column({
    type: 'enum',
    enum: SquareEnum,
  })
  to: SquareEnum;

  @Column({
    type: 'enum',
    enum: PieceSymbolEnum,
  })
  piece: PieceSymbolEnum;

  @Column({
    type: 'enum',
    enum: PieceSymbolEnum,
    nullable: true,
  })
  captured?: PieceSymbolEnum;

  @Column({
    type: 'enum',
    enum: PieceSymbolEnum,
    nullable: true,
  })
  promotion?: PieceSymbolEnum;

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
