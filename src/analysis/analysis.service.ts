import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Analysis } from './entities/analysis.entity';
import { AnalysisMove } from './entities/analysis-move.entity';
import { InfoResult } from './entities/info-result.entity';
import { Move } from './entities/move.entity';
import { CreateAnalysisDto } from './dto/request/create-analysis.dto';
import { User } from '../users/user.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { AnalysisResponseDto } from './dto/response/analysis-response.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private readonly analysisRepository: Repository<Analysis>,
    @InjectRepository(AnalysisMove)
    private readonly analysisMoveRepository: Repository<AnalysisMove>,
    @InjectRepository(InfoResult)
    private readonly infoResultRepository: Repository<InfoResult>,
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
    private readonly dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {}

  async create(createAnalysisDto: CreateAnalysisDto, user: User): Promise<Analysis> {
    // Vérification de l'unicité
    await this.validateUniqueAnalysis(createAnalysisDto.pgn, user.id);

    // Utilisation d'une transaction pour garantir l'intégrité des données
    // Optimisation : Utilisation d'une transaction pour éviter les appels multiples à la base de données
    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Création de l'analyse
      const analysis = await this.createAnalysisEntity(createAnalysisDto, user, transactionalEntityManager);

      // Création des coups et résultats associés
      await this.createMovesWithResults(createAnalysisDto.moves, analysis, transactionalEntityManager);

      return analysis;
    });
  }

  async findAllByUserId(userId: string, options: IPaginationOptions): Promise<Pagination<Analysis>> {
    return paginate<Analysis>(this.analysisRepository, options, {
      where: { user: { id: userId } },
    });
  }

  /**
   * Trouver une analyse par son ID et l'utilisateur connecté
   * @param id ID de l'analyse
   * @param currentUser Utilisateur connecté
   */
  async findOneById(id: string, currentUser: User): Promise<AnalysisResponseDto> {
    const analysis = await this.analysisRepository.findOne({
      where: { id },
      relations: {
        user: true,
        moves: {
          move: true,
          engineResults: true,
        },
      },
    });

    if (!analysis) {
      throw new NotFoundException(`Analyse avec l'ID "${id}" non trouvée`);
    }

    if (analysis.user.id !== currentUser.id) {
      throw new ForbiddenException('Vous ne pouvez pas accéder à cette analyse');
    }

    return AnalysisResponseDto.fromEntity(analysis);
  }

  async deleteOneById(id: string, currentUser: User): Promise<void> {
    const analysis = await this.analysisRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!analysis) {
      throw new NotFoundException(`Analyse avec l'ID "${id}" non trouvée`);
    }

    if (analysis.user.id !== currentUser.id) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer cette analyse');
    }

    await this.analysisRepository.softDelete(id);
  }

  async restoreOneById(id: string, currentUser: User): Promise<void> {
    const analysis = await this.analysisRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: {
        user: true,
      },
    });

    if (!analysis) {
      throw new NotFoundException(`Analyse avec l'ID "${id}" non trouvée`);
    }

    if (analysis.user.id !== currentUser.id) {
      throw new ForbiddenException('Vous ne pouvez pas restaurer cette analyse');
    }

    const existingAnalysis = await this.findNonDeletedByPgnAndUserId(analysis.pgn, currentUser.id);
    if (existingAnalysis) {
      throw new ConflictException('Une analyse non supprimée existe déjà avec ce PGN');
    }

    await this.analysisRepository.restore(id);
  }

  private async findNonDeletedByPgnAndUserId(pgn: string, userId: string): Promise<Analysis> {
    return this.analysisRepository.findOne({
      where: { pgn, user: { id: userId }, deletedAt: null },
    });
  }

  private async validateUniqueAnalysis(pgn: string, userId: string): Promise<void> {
    const existingAnalysis = await this.findOneByPgnAndUserId(pgn, userId);
    if (existingAnalysis) {
      throw new ConflictException(
        this.i18n.translate('common.ERRORS.ALREADY_EXISTS', { args: { property: 'Analyse' } }),
      );
    }
  }

  private async createAnalysisEntity(
    createAnalysisDto: CreateAnalysisDto,
    user: User,
    manager: EntityManager,
  ): Promise<Analysis> {
    // Création de l'analyse
    const analysis = this.analysisRepository.create({
      pgn: createAnalysisDto.pgn,
      variants: createAnalysisDto.variants,
      header: createAnalysisDto.header,
      user,
    });
    return await manager.save(Analysis, analysis);
  }

  private async createMovesWithResults(
    movesDto: CreateAnalysisDto['moves'],
    analysis: Analysis,
    manager: EntityManager,
  ): Promise<void> {
    for (const moveDto of movesDto) {
      // Création du coup
      const move = this.moveRepository.create(moveDto.move);
      await manager.save(Move, move);

      // Création du coup d'analyse
      const analysisMove = this.analysisMoveRepository.create({
        move,
        fen: moveDto.fen,
        classification: moveDto.classification,
        analysis,
      });
      await manager.save(AnalysisMove, analysisMove);

      // Création des engine results en lot
      const engineResults = moveDto.engineResults.map((resultDto) =>
        this.infoResultRepository.create({
          ...resultDto,
          analysisMove,
        }),
      );
      await manager.save(InfoResult, engineResults);
    }
  }

  private async findOneByPgnAndUserId(pgn: string, userId: string): Promise<Analysis> {
    return this.analysisRepository.findOne({
      where: { pgn, user: { id: userId } },
    });
  }
}
