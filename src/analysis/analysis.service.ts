import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analysis } from './entities/analysis.entity';
import { AnalysisMove } from './entities/analysis-move.entity';
import { InfoResult } from './entities/info-result.entity';
import { Move } from './entities/move.entity';
import { CreateAnalysisDto } from './dto/request/create-analysis.dto';
import { User } from '../users/user.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { AnalysisResponseDto } from './dto/response/analysis-response.dto';

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
  ) {}

  // TODO: Il faut refactoriser cette méthode pour qu'elle soit plus lisible et utiliser des transactions
  async create(createAnalysisDto: CreateAnalysisDto, user: User): Promise<Analysis> {
    if (await this.findOneByPgnAndUserId(createAnalysisDto.pgn, user.id)) {
      throw new ConflictException('Analyse déjà existante');
    }

    const { pgn, variants, header, moves } = createAnalysisDto;

    // Création de l'analyse
    const analysis: Analysis = this.analysisRepository.create({ pgn, variants, header, user });
    await this.analysisRepository.save(analysis);

    // Pour chaque coup de l'analyse
    for (const moveDto of moves) {
      // Création du coup
      const move = this.moveRepository.create(moveDto.move);
      await this.moveRepository.save(move);

      // Création du coup d'analyse pour le coup
      const analysisMove = this.analysisMoveRepository.create({
        move,
        fen: moveDto.fen,
        classification: moveDto.classification,
        analysis,
      });
      await this.analysisMoveRepository.save(analysisMove);

      // Pour chaque résultat moteur du coup d'analyse
      for (const engineResultDto of moveDto.engineResults) {
        // Création du résultat moteur pour le coup d'analyse
        const engineResult = this.infoResultRepository.create({
          ...engineResultDto,
          analysisMove,
        });
        await this.infoResultRepository.save(engineResult);
      }
    }

    return analysis;
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

  private async findOneByPgnAndUserId(pgn: string, userId: string): Promise<Analysis> {
    return this.analysisRepository.findOne({
      where: { pgn, user: { id: userId } },
    });
  }
}
