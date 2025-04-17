import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Analysis } from './entities/analysis.entity';
import { User } from '../users/entities/user.entity';
import { CreateAnalysisDto } from './dto/request/create-analysis.dto';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { MovesService } from '../moves/moves.service';
import { AnalysisResponseDto } from './dto/response/analysis-response.dto';
import { UserTypeEnum } from '../users/entities/user-type.enum';
import { InfoResult } from './entities/info-result.entity';
import { Move } from './entities/move.entity';
import { ColorEnum } from './enums/color.enum';
import { PieceSymbolEnum } from './enums/piece-symbol.enum';
import { SquareEnum } from './enums/square.enum';
import { AnalysisMove } from './entities/analysis-move.entity';
import * as paginationModule from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('AnalysisService', () => {
  let service: AnalysisService;
  let analysisRepository: Repository<Analysis>;

  const mockUser: User = {
    id: 'user-id-1',
    email: 'test@example.com',
    username: 'test',
    password: 'password',
    analyses: [],
    settings: null,
    accountType: UserTypeEnum.CLASSIC,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockMove: Move = {
    id: 'move-id-1',
    color: ColorEnum.White,
    from: SquareEnum.E2,
    to: SquareEnum.E4,
    piece: PieceSymbolEnum.Pawn,
    captured: null,
    promotion: null,
    flags: 'b',
    san: 'e4',
    lan: 'e2e4',
    before: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
    after: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockEngineResult: InfoResult = {
    id: 'info-result-id-1',
    type: 'info',
    depth: 20,
    selDepth: 20,
    eval: 0.3,
    centiPawns: 30,
    winChance: 0.3,
    mate: null,
    move: 'e2e4',
    from: 'e2',
    to: 'e4',
    pv: ['e2e4'],
    analysisMove: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockAnalysisMove: AnalysisMove = {
    id: 'analysis-move-id-1',
    move: mockMove,
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
    engineResults: [mockEngineResult],
    classification: null,
    order: 1,
    analysis: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockAnalysis: Analysis = {
    id: 'analysis-id-1',
    pgn: '1. e4 e5',
    variants: 1,
    header: { White: 'Player1', Black: 'Player2' },
    user: mockUser,
    moves: [mockAnalysisMove],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockAnalysisResponseDto: AnalysisResponseDto = {
    id: 'analysis-id-1',
    pgn: '1. e4 e5',
    variants: 1,
    header: { White: 'Player1', Black: 'Player2' },
    moves: [mockAnalysisMove],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as AnalysisResponseDto;

  const mockCreateAnalysisDto: CreateAnalysisDto = {
    pgn: '1. e4 e5',
    variants: 1,
    header: { White: 'Player1', Black: 'Player2' },
    moves: [mockAnalysisMove],
  };

  const mockAnalysisRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockI18nService = {
    translate: jest.fn().mockReturnValue('Analyse existe déjà'),
  };

  const mockMovesService = {
    createMovesWithResults: jest.fn(),
  };

  beforeEach(async () => {
    // Réinitialisation du mock paginate pour chaque test
    (paginationModule.paginate as jest.Mock).mockResolvedValue({
      items: [mockAnalysis],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: getRepositoryToken(Analysis),
          useValue: mockAnalysisRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
        {
          provide: MovesService,
          useValue: mockMovesService,
        },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    service = module.get<AnalysisService>(AnalysisService);
    analysisRepository = module.get<Repository<Analysis>>(getRepositoryToken(Analysis));
    // Mock de fromEntity pour tous les tests
    jest.spyOn(AnalysisResponseDto, 'fromEntity').mockReturnValue(mockAnalysisResponseDto);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer une analyse avec succès', async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(null);
      mockAnalysisRepository.create.mockReturnValue(mockAnalysis);
      mockDataSource.transaction.mockImplementation(async (callback) => {
        return callback({
          save: jest.fn().mockResolvedValue(mockAnalysis),
        });
      });

      const result = await service.create(mockCreateAnalysisDto, mockUser);

      expect(mockAnalysisRepository.findOne).toHaveBeenCalledWith({
        where: { pgn: mockCreateAnalysisDto.pgn, user: { id: mockUser.id } },
      });
      expect(mockAnalysisRepository.create).toHaveBeenCalled();
      expect(mockMovesService.createMovesWithResults).toHaveBeenCalled();
      expect(result).toEqual(mockAnalysis);
    });

    it("devrait lever une ConflictException si l'analyse existe déjà", async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(mockAnalysis);

      await expect(service.create(mockCreateAnalysisDto, mockUser)).rejects.toThrow(ConflictException);
      expect(mockI18nService.translate).toHaveBeenCalled();
    });
  });

  describe('findAllByUserId', () => {
    it("devrait renvoyer les analyses paginées pour l'utilisateur", async () => {
      const result = await service.findAllByUserId(mockUser.id, { page: 1, limit: 10 });

      expect(paginationModule.paginate).toHaveBeenCalledWith(
        analysisRepository,
        { page: 1, limit: 10 },
        {
          where: { user: { id: mockUser.id } },
        },
      );
      expect(result.items).toEqual([mockAnalysis]);
    });
  });

  describe('findOneById', () => {
    it('devrait renvoyer une analyse par ID', async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(mockAnalysis);

      const result = await service.findOneById(mockAnalysis.id, mockUser);

      expect(mockAnalysisRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockAnalysis.id },
        relations: {
          user: true,
          moves: {
            move: true,
            engineResults: true,
          },
        },
        order: {
          moves: {
            order: 'ASC',
          },
        },
      });
      expect(AnalysisResponseDto.fromEntity).toHaveBeenCalledWith(mockAnalysis);
      expect(result).toEqual(mockAnalysisResponseDto);
    });

    it("devrait lever une NotFoundException si l'analyse n'existe pas", async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOneById('non-existent-id', mockUser)).rejects.toThrow(NotFoundException);
    });

    it("devrait lever une ForbiddenException si l'utilisateur n'est pas le propriétaire", async () => {
      const differentUser = { id: 'different-user-id' } as User;
      mockAnalysisRepository.findOne.mockResolvedValueOnce(mockAnalysis);

      await expect(service.findOneById(mockAnalysis.id, differentUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteOneById', () => {
    it('devrait supprimer une analyse avec succès', async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(mockAnalysis);
      mockAnalysisRepository.softDelete.mockResolvedValueOnce({ affected: 1 });

      await service.deleteOneById(mockAnalysis.id, mockUser);

      expect(mockAnalysisRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockAnalysis.id },
        relations: { user: true },
      });
      expect(mockAnalysisRepository.softDelete).toHaveBeenCalledWith(mockAnalysis.id);
    });

    it("devrait lever une NotFoundException si l'analyse n'existe pas", async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.deleteOneById('non-existent-id', mockUser)).rejects.toThrow(NotFoundException);
    });

    it("devrait lever une ForbiddenException si l'utilisateur n'est pas le propriétaire", async () => {
      const differentUser = { id: 'different-user-id' } as User;
      mockAnalysisRepository.findOne.mockResolvedValueOnce(mockAnalysis);

      await expect(service.deleteOneById(mockAnalysis.id, differentUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('restoreOneById', () => {
    it('devrait restaurer une analyse avec succès', async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(mockAnalysis).mockResolvedValueOnce(null);
      mockAnalysisRepository.restore.mockResolvedValueOnce({ affected: 1 });

      await service.restoreOneById(mockAnalysis.id, mockUser);

      expect(mockAnalysisRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockAnalysisRepository.findOne).toHaveBeenNthCalledWith(1, {
        where: { id: mockAnalysis.id },
        withDeleted: true,
        relations: { user: true },
      });
      expect(mockAnalysisRepository.restore).toHaveBeenCalledWith(mockAnalysis.id);
    });

    it("devrait lever une NotFoundException si l'analyse n'existe pas", async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.restoreOneById('non-existent-id', mockUser)).rejects.toThrow(NotFoundException);
    });

    it("devrait lever une ForbiddenException si l'utilisateur n'est pas le propriétaire", async () => {
      const differentUser = { id: 'different-user-id' } as User;
      mockAnalysisRepository.findOne.mockResolvedValueOnce(mockAnalysis);

      await expect(service.restoreOneById(mockAnalysis.id, differentUser)).rejects.toThrow(ForbiddenException);
    });

    it('devrait lever une ConflictException si une analyse non supprimée avec le même PGN existe déjà', async () => {
      mockAnalysisRepository.findOne.mockResolvedValueOnce(mockAnalysis).mockResolvedValueOnce(mockAnalysis);

      await expect(service.restoreOneById(mockAnalysis.id, mockUser)).rejects.toThrow(ConflictException);
    });
  });
});
