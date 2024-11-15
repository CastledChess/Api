import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analysis } from './entities/analysis.entity';
import { AnalysisMove } from './entities/analysis-move.entity';
import { InfoResult } from './entities/info-result.entity';
import { Move } from './entities/move.entity';
import { CreateAnalysisDto } from './dto/request/create-analysis.dto';
import { User } from '../users/user.entity';

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

  async create(createAnalysisDto: CreateAnalysisDto, user: User): Promise<Analysis> {
    if (await this.findOneByPgnAndUserId(createAnalysisDto.pgn, user.id)) {
      throw new ConflictException('Analysis already exists');
    }

    const { pgn, variants, header, moves } = createAnalysisDto;

    const analysis: Analysis = this.analysisRepository.create({ pgn, variants, header, user });
    await this.analysisRepository.save(analysis);

    for (const moveDto of moves) {
      const move = this.moveRepository.create(moveDto.move);
      await this.moveRepository.save(move);

      const analysisMove = this.analysisMoveRepository.create({
        move,
        fen: moveDto.fen,
        classification: moveDto.classification,
        analysis,
      });
      await this.analysisMoveRepository.save(analysisMove);

      for (const engineResultDto of moveDto.engineResults) {
        const engineResult = this.infoResultRepository.create({
          ...engineResultDto,
          analysisMove,
        });
        await this.infoResultRepository.save(engineResult);
      }
    }

    return analysis;
  }

  private async findOneByPgnAndUserId(pgn: string, userId: string): Promise<Analysis> {
    return this.analysisRepository.findOne({
      where: { pgn, user: { id: userId } },
    });
  }
}
