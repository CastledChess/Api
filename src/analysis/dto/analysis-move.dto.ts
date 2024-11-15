import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MoveDto } from './move.dto';
import { AnalysisMoveClassificationEnum } from '../enums/analysis-move-classification.enum';
import { InfoResultDto } from './info-result.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AnalysisMoveDto {
  @ApiProperty({ description: 'Le coup analysé' })
  @ValidateNested()
  @Type(() => MoveDto)
  move: MoveDto;

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
  @Type(() => InfoResultDto)
  engineResults: InfoResultDto[];

  @ApiProperty({ description: 'La classification du coup analysé', enum: AnalysisMoveClassificationEnum })
  @IsOptional()
  @IsEnum(AnalysisMoveClassificationEnum)
  classification?: typeof AnalysisMoveClassificationEnum;
}
