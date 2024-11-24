import { ApiProperty } from '@nestjs/swagger';
import { Analysis } from '../../entities/analysis.entity';
import { AnalysisMoveResponseDto } from './analysis-move-response.dto';
import { BaseDto } from '../../../common/dto/base.dto';

export class AnalysisResponseDto extends BaseDto {
  @ApiProperty({ example: 3 })
  variants: number;

  @ApiProperty({
    example: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "202…]',
  })
  pgn: string;

  @ApiProperty({
    example: {
      Event: 'Live Chess',
      Site: 'Chess.com',
      Date: '2024.11.11',
      Round: '?',
      White: 'player1',
      Black: 'player2',
      Result: '0-1',
    },
  })
  header: Record<string, string>;

  @ApiProperty({ type: [AnalysisMoveResponseDto] })
  moves: AnalysisMoveResponseDto[];

  static fromEntity(analysis: Analysis): AnalysisResponseDto {
    const response = new AnalysisResponseDto();
    response.id = analysis.id;
    response.variants = analysis.variants;
    response.pgn = analysis.pgn;
    response.header = analysis.header;
    response.moves = analysis.moves?.map((move) => AnalysisMoveResponseDto.fromEntity(move)) || [];
    response.createdAt = analysis.createdAt;
    response.updatedAt = analysis.updatedAt;
    response.deletedAt = analysis.deletedAt;

    return response;
  }
}
