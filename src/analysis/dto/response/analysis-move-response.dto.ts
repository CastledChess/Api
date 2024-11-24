import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MoveResponseDto } from './move-response.dto';
import { AnalysisMoveClassificationEnum } from '../../enums/analysis-move-classification.enum';
import { InfoResultResponseDto } from './info-result-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/dto/base.dto';
import { AnalysisMove } from '../../entities/analysis-move.entity';

export class AnalysisMoveResponseDto extends BaseDto {
  @ApiProperty({ description: 'Le coup ' })
  @ValidateNested()
  @Type(() => MoveResponseDto)
  move: MoveResponseDto;

  @ApiProperty({
    description: 'La position FEN du coup analysé',
    example: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  })
  @IsString()
  @IsNotEmpty()
  fen: string;

  @ApiProperty({ description: 'Les résultats du moteur pour le coup analysé' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InfoResultResponseDto)
  engineResults: InfoResultResponseDto[];

  @ApiProperty({ description: 'La classification du coup analysé', enum: AnalysisMoveClassificationEnum })
  @IsOptional()
  @IsEnum(AnalysisMoveClassificationEnum)
  classification?: typeof AnalysisMoveClassificationEnum;

  static fromEntity(analysisMove: AnalysisMove): AnalysisMoveResponseDto {
    const response = new AnalysisMoveResponseDto();
    response.id = analysisMove.id;
    response.move = MoveResponseDto.fromEntity(analysisMove.move);
    response.fen = analysisMove.fen;
    response.engineResults =
      analysisMove.engineResults?.map((result) => InfoResultResponseDto.fromEntity(result)) || [];
    response.classification = analysisMove.classification;
    response.createdAt = analysisMove.createdAt;
    response.updatedAt = analysisMove.updatedAt;
    response.deletedAt = analysisMove.deletedAt;

    return response;
  }
}
