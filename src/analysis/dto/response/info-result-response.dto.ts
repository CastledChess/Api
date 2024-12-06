import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InfoResult } from '../../entities/info-result.entity';
import { BaseDto } from '../../../common/dto/base.dto';

export class InfoResultResponseDto extends BaseDto {
  @ApiProperty({ description: 'Le type de résultat', example: 'info' })
  @IsString()
  type: 'info';

  @ApiProperty({ description: 'Le nombre de noeuds analysés', example: 14 })
  @IsOptional()
  @IsNumber()
  depth?: number;

  @ApiProperty({ description: 'Le nombre de noeuds analysés', example: 24 })
  @IsOptional()
  @IsNumber()
  selDepth?: number;

  @ApiProperty({ description: "Le score de l'évaluation", example: 0.37 })
  @IsOptional()
  @IsNumber()
  eval?: number;

  @ApiProperty({ description: "Le score de l'évaluation en centi-pions", example: 37 })
  @IsOptional()
  @IsNumber()
  centiPawns?: number;

  @ApiProperty({ description: 'La chance de gagner', example: 0.5 })
  @IsOptional()
  @IsNumber()
  winChance?: number;

  @ApiProperty({ description: 'La chance de faire match nul', example: 0.5 })
  @IsOptional()
  @IsNumber()
  mate?: number;

  @ApiProperty({ description: 'Le coup principal du moteur', example: 'e4' })
  @IsOptional()
  @IsString()
  move?: string;

  @ApiProperty({ description: 'Le coup principal du moteur', example: 'e4' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiProperty({ description: 'Le coup principal du moteur', example: 'e4' })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiProperty({ description: 'Le coup principal du moteur', example: 'e4' })
  @IsArray()
  @IsString({ each: true })
  pv: string[];

  static fromEntity(infoResult: InfoResult): InfoResultResponseDto {
    const response = new InfoResultResponseDto();
    response.id = infoResult.id;
    response.type = infoResult.type;
    response.depth = infoResult.depth;
    response.selDepth = infoResult.selDepth;
    response.eval = infoResult.eval;
    response.centiPawns = infoResult.centiPawns;
    response.winChance = infoResult.winChance;
    response.mate = infoResult.mate;
    response.move = infoResult.move;
    response.from = infoResult.from;
    response.to = infoResult.to;
    response.pv = infoResult.pv;
    response.createdAt = infoResult.createdAt;
    response.updatedAt = infoResult.updatedAt;
    response.deletedAt = infoResult.deletedAt;

    return response;
  }
}
