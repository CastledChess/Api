import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Analysis } from './entities/analysis.entity';
import { CreateAnalysisDto } from './dto/request/create-analysis.dto';
import { User } from '../users/user.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { AnalysisResponseDto } from './dto/response/analysis-response.dto';
import { I18nService } from 'nestjs-i18n';
import { MovesService } from 'src/moves/moves.service';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private readonly analysisRepository: Repository<Analysis>,
    private readonly dataSource: DataSource,
    private readonly i18n: I18nService,
    private readonly moveService: MovesService,
  ) {}

  /**
   * Crée une analyse avec ses moves et résultats associés
   * @param createAnalysisDto Les données de l'analyse
   * @param user L'utilisateur créant l'analyse
   * @returns L'analyse créée
   */
  async create(createAnalysisDto: CreateAnalysisDto, user: User): Promise<Analysis> {
    // Vérification de l'unicité
    await this.validateUniqueAnalysis(createAnalysisDto.pgn, user.id);

    // Création de l'analyse dans une transaction pour garantir l'intégrité des données
    // La transcation permet de faire plusieurs opérations en une seule fois
    return await this.dataSource.transaction(async (manager) => {
      // Création de l'analyse
      const analysis = this.analysisRepository.create({
        pgn: createAnalysisDto.pgn,
        variants: createAnalysisDto.variants,
        header: createAnalysisDto.header,
        user,
      });
      await manager.save(Analysis, analysis);

      // Délégation de la création des coups au MoveService
      await this.moveService.createMovesWithResults(createAnalysisDto.moves, analysis, manager);

      return analysis;
    });
  }

  /**
   * Récupère les analyses de l'utilisateur paginées
   * @param userId L'ID de l'utilisateur
   * @param options Les options de pagination
   * @returns Les analyses paginées
   */
  async findAllByUserId(userId: string, options: IPaginationOptions): Promise<Pagination<Analysis>> {
    return paginate<Analysis>(this.analysisRepository, options, {
      where: { user: { id: userId } },
    });
  }

  /**
   * Récupère une analyse par son ID
   * @param id L'ID de l'analyse
   * @param currentUser L'utilisateur courant
   * @returns L'analyse
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

  /**
   * Supprime une analyse par son ID
   * @param id L'ID de l'analyse
   * @param currentUser L'utilisateur courant
   */
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

  /**
   * Restaure une analyse par son ID (soft delete)
   * @param id L'ID de l'analyse
   * @param currentUser L'utilisateur connecté
   */
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

  private async findOneByPgnAndUserId(pgn: string, userId: string): Promise<Analysis> {
    return this.analysisRepository.findOne({
      where: { pgn, user: { id: userId } },
    });
  }
}
