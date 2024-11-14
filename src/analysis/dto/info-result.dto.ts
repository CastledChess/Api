import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InfoResultDto {
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
}
