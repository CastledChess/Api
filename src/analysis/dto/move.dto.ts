import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PieceSymbolEnum } from '../enums/piece-symbol.enum';
import { SquareEnum } from '../enums/square.enum';
import { ColorEnum } from '../enums/color.enum';

export class MoveDto {
  @ApiProperty({ description: 'La couleur du joueur qui a joué le coup', example: 'w' })
  @IsString()
  @IsNotEmpty()
  color: ColorEnum;

  @ApiProperty({ description: 'La case de départ du coup', example: 'e2' })
  @IsString()
  @IsNotEmpty()
  from: SquareEnum;

  @ApiProperty({ description: "La case d'arrivée du coup", example: 'e4' })
  @IsString()
  @IsNotEmpty()
  to: SquareEnum;

  @ApiProperty({ description: 'La pièce déplacée', example: 'P' })
  @IsString()
  @IsNotEmpty()
  piece: PieceSymbolEnum;

  @ApiProperty({ description: 'La pièce capturée', example: 'P' })
  @IsOptional()
  @IsString()
  captured?: PieceSymbolEnum;

  @ApiProperty({ description: 'La promotion de la pièce', example: 'Q' })
  @IsOptional()
  @IsString()
  promotion?: PieceSymbolEnum;

  @ApiProperty({ description: 'Les flags du coup', example: 'n' })
  @IsString()
  @IsNotEmpty()
  flags: string;

  @ApiProperty({ description: 'Le coup SAN', example: 'e4' })
  @IsString()
  @IsNotEmpty()
  san: string;

  @ApiProperty({ description: 'Le coup UCI', example: 'e2e4' })
  @IsString()
  @IsNotEmpty()
  lan: string;

  @ApiProperty({ description: 'Le coup UCI', example: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })
  @IsString()
  @IsNotEmpty()
  before: string;

  @ApiProperty({ description: 'Le coup UCI', example: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1' })
  @IsString()
  @IsNotEmpty()
  after: string;
}
