import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { AnalysisMoveDto } from '../analysis-move.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnalysisDto {
  @ApiProperty({
    description: 'La partie analysée',
    example: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "202…2 Nb4 29. Rc7 Rxd4 30. Rxe7 Rxe7 31. Rc8+ Kh7 0-1',
  })
  @IsString()
  @IsNotEmpty()
  pgn: string;

  @ApiProperty({ description: 'Le nombre de variantes à analyser', example: 3 })
  @IsNumber()
  @IsNotEmpty()
  variants: number;

  @ApiProperty({
    description: 'Les entêtes de la partie',
    example: {
      Event: 'Live Chess',
      Site: 'Chess.com',
      Date: '2024.11.11',
      Round: '?',
      White: 'jtpeg',
      Black: 'LeGrandJaris',
      Result: '0-1',
      TimeControl: '600',
      WhiteElo: '975',
      BlackElo: '988',
      Termination: 'LeGrandJaris a gagné par abandon',
      ECO: 'D08',
      EndTime: '22:38:37 GMT+0000',
      Link: 'https://www.chess.com/game/live/120832550446',
    },
  })
  @IsObject()
  @IsNotEmpty()
  header: Record<string, string>;

  @ApiProperty({
    description: 'Les coups de la partie analysée',
    example: [
      {
        move: {
          color: 'w',
          from: 'e2',
          to: 'e4',
          piece: 'P',
          flags: 'n',
          san: 'e4',
          lan: 'e2e4',
          before: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          after: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        },
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        classification: 'Brilliant',
        engineResults: [
          {
            type: 'info',
            depth: 14,
            selDepth: 24,
            eval: 0.37,
            centiPawns: 37,
            winChance: 0.5,
            mate: 0.5,
            move: 'e4',
            from: 'e2',
            to: 'e4',
            pv: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O'],
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalysisMoveDto)
  @IsNotEmpty()
  moves: AnalysisMoveDto[];
}
