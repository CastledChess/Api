import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { AnalysisMoveResponseDto } from 'src/analysis/dto/response/analysis-move-response.dto';
import { MoveResponseDto } from 'src/analysis/dto/response/move-response.dto';
import { AnalysisMove } from 'src/analysis/entities/analysis-move.entity';
import { Analysis } from 'src/analysis/entities/analysis.entity';
import { Move } from 'src/analysis/entities/move.entity';
import { InfoResultsService } from 'src/info-results/info-results.service';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class MovesService {
  constructor(
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
    @InjectRepository(AnalysisMove)
    private readonly analysisMoveRepository: Repository<AnalysisMove>,
    private readonly infoResultService: InfoResultsService,
  ) {}

  /**
   * Crée les moves et les InfoResults associés à une analyse
   *
   * @param analysisMovesDto Les moves à créer
   * @param analysis L'analyse parente
   * @param manager Le manager de transaction
   */
  async createMovesWithResults(
    analysisMovesDto: AnalysisMoveResponseDto[],
    analysis: Analysis,
    manager: EntityManager,
  ): Promise<void> {
    for (const analysisMoveDto of analysisMovesDto) {
      const order: number = analysisMovesDto.findIndex((move) => move === analysisMoveDto);

      // Création du move
      const move = plainToClass(Move, analysisMoveDto.move as MoveResponseDto);
      await this.createMove(move);

      // Création de l'AnalysisMove
      const analysisMove = this.analysisMoveRepository.create({
        move,
        fen: analysisMoveDto.fen,
        classification: analysisMoveDto.classification,
        analysis,
        // L'ordre du coup dans l'analyse
        // On ajoute 1, car les index commencent à : 0
        order: order + 1,
      });
      await manager.save(AnalysisMove, analysisMove);

      // Délégation de la création des InfoResults au InfoResultService
      await this.infoResultService.createInfoResults(analysisMoveDto.engineResults, analysisMove, manager);
    }
  }

  /**
   * Crée un move
   * @param move Le move à créer
   * @returns Le move créé
   */
  async createMove(move: Move): Promise<Move> {
    return await this.moveRepository.save(move);
  }
}
