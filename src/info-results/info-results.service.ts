import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InfoResultResponseDto } from 'src/analysis/dto/response/info-result-response.dto';
import { AnalysisMove } from 'src/analysis/entities/analysis-move.entity';
import { InfoResult } from 'src/analysis/entities/info-result.entity';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class InfoResultsService {
  constructor(
    @InjectRepository(InfoResult)
    private readonly infoResultRepository: Repository<InfoResult>,
  ) {}

  /**
   * Crée les InfoResults associés à un AnalysisMove
   * @param infoResultDto Les InfoResults à créer
   * @param analysisMove L'AnalysisMove parent
   * @param manager Le manager de transaction
   */
  async createInfoResults(
    infoResultDto: InfoResultResponseDto[],
    analysisMove: AnalysisMove,
    manager: EntityManager,
  ): Promise<void> {
    const engineResults = infoResultDto.map((resultDto) =>
      this.infoResultRepository.create({
        ...resultDto,
        analysisMove,
      }),
    );
    await manager.save(InfoResult, engineResults);
  }
}
