import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PieceSymbolType } from '../types/piece-symbol.type';
import { SquareType } from '../types/square.type';
import { ColorType } from '../types/color.type';

export class MoveDto {
  @ApiProperty({ description: 'La couleur du joueur qui a joué le coup', example: 'w' })
  @IsString()
  @IsNotEmpty()
  color: ColorType;

  @ApiProperty({ description: 'La case de départ du coup', example: 'e2' })
  @IsString()
  @IsNotEmpty()
  from: SquareType;

  @ApiProperty({ description: "La case d'arrivée du coup", example: 'e4' })
  @IsString()
  @IsNotEmpty()
  to: SquareType;

  @ApiProperty({ description: 'La pièce déplacée', example: 'P' })
  @IsString()
  @IsNotEmpty()
  piece: PieceSymbolType;

  @ApiProperty({ description: 'La pièce capturée', example: 'P' })
  @IsOptional()
  @IsString()
  captured?: PieceSymbolType;

  @ApiProperty({ description: 'La promotion de la pièce', example: 'Q' })
  @IsOptional()
  @IsString()
  promotion?: PieceSymbolType;

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
