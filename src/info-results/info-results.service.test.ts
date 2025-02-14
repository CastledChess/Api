import { Test, TestingModule } from '@nestjs/testing';
import { InfoResultsService } from './info-results.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InfoResult } from 'src/analysis/entities/info-result.entity';
import { Repository, EntityManager } from 'typeorm';
import { InfoResultResponseDto } from 'src/analysis/dto/response/info-result-response.dto';
import { AnalysisMove } from 'src/analysis/entities/analysis-move.entity';

describe('InfoResultsService', () => {
  let service: InfoResultsService;
  let infoResultRepository: Repository<InfoResult>;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InfoResultsService,
        {
          provide: getRepositoryToken(InfoResult),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InfoResultsService>(InfoResultsService);
    infoResultRepository = module.get<Repository<InfoResult>>(getRepositoryToken(InfoResult));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInfoResults', () => {
    it('should create and save info results', async () => {
      const infoResultDto: InfoResultResponseDto[] = [
        {
          type: 'info',
          depth: 11,
          selDepth: 1,
          eval: 1,
          centiPawns: 37,
          winChance: 0.5,
          mate: 0.5,
          move: 'e4',
          from: 'e4',
          to: 'e5',
          pv: ['pv1'],
          id: '',
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
        {
          type: 'info',
          depth: 11,
          selDepth: 1,
          eval: 1,
          centiPawns: 37,
          winChance: 0.5,
          mate: 0.5,
          move: 'e4',
          from: 'e4',
          to: 'e5',
          pv: ['pv1'],
          id: '',
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
      ];
      const analysisMove: AnalysisMove = new AnalysisMove();

      await service.createInfoResults(infoResultDto, analysisMove, entityManager);

      expect(infoResultRepository.create).toHaveBeenCalledTimes(infoResultDto.length);
      infoResultDto.forEach((dto) => {
        expect(infoResultRepository.create).toHaveBeenCalledWith({ ...dto, analysisMove });
      });
      expect(entityManager.save).toHaveBeenCalled();
    });
  });
});
