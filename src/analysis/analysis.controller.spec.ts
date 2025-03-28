import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/request/create-analysis.dto';
import { User } from '../users/entities/user.entity';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../common/constants';
import { AnalysisResponseDto } from './dto/response/analysis-response.dto';
import { UserTypeEnum } from '../users/entities/user-type.enum';
import { AnalysisMove } from './entities/analysis-move.entity';
import { Analysis } from './entities/analysis.entity';
import { InfoResult } from './entities/info-result.entity';
import { Move } from './entities/move.entity';
import { ColorEnum } from './enums/color.enum';
import { PieceSymbolEnum } from './enums/piece-symbol.enum';
import { SquareEnum } from './enums/square.enum';

describe('AnalysisController', () => {
  let controller: AnalysisController;

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

  const mockAnalysisResponse: AnalysisResponseDto = {
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

  const mockPaginatedResponse = {
    items: [mockAnalysis],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: DEFAULT_PAGE_SIZE,
      totalPages: 1,
      currentPage: DEFAULT_PAGE_NUMBER,
    },
  };

  const mockAnalysisService = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findOneById: jest.fn(),
    deleteOneById: jest.fn(),
    restoreOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        {
          provide: AnalysisService,
          useValue: mockAnalysisService,
        },
      ],
    }).compile();

    controller = module.get<AnalysisController>(AnalysisController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer une nouvelle analyse', async () => {
      mockAnalysisService.create.mockResolvedValue(mockAnalysis);
      const request = { user: mockUser } as { user: User };

      const result = await controller.create(mockCreateAnalysisDto, request as never);

      expect(mockAnalysisService.create).toHaveBeenCalledWith(mockCreateAnalysisDto, mockUser);
      expect(result).toEqual(mockAnalysis);
    });
  });

  describe('findPaginatedByUserId', () => {
    it("devrait retourner les analyses paginées pour l'utilisateur courant avec les valeurs par défaut", async () => {
      mockAnalysisService.findAllByUserId.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findPaginatedByUserId(mockUser);

      expect(mockAnalysisService.findAllByUserId).toHaveBeenCalledWith(mockUser.id, {
        page: DEFAULT_PAGE_NUMBER,
        limit: DEFAULT_PAGE_SIZE,
      });
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("devrait retourner les analyses paginées pour l'utilisateur courant avec des valeurs personnalisées", async () => {
      mockAnalysisService.findAllByUserId.mockResolvedValue(mockPaginatedResponse);
      const customPage = 2;
      const customLimit = 5;

      const result = await controller.findPaginatedByUserId(mockUser, customPage, customLimit);

      expect(mockAnalysisService.findAllByUserId).toHaveBeenCalledWith(mockUser.id, {
        page: customPage,
        limit: customLimit,
      });
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('findOneById', () => {
    it('devrait retourner une analyse par son ID', async () => {
      mockAnalysisService.findOneById.mockResolvedValue(mockAnalysisResponse);
      const request = { user: mockUser };

      const result = await controller.findOneById(mockAnalysis.id, request as never);

      expect(mockAnalysisService.findOneById).toHaveBeenCalledWith(mockAnalysis.id, mockUser);
      expect(result).toEqual(mockAnalysisResponse);
    });
  });

  describe('deleteOneById', () => {
    it('devrait supprimer une analyse par son ID', async () => {
      mockAnalysisService.deleteOneById.mockResolvedValue(undefined);
      const request = { user: mockUser };

      await controller.deleteOneById(mockAnalysis.id, request as never);

      expect(mockAnalysisService.deleteOneById).toHaveBeenCalledWith(mockAnalysis.id, mockUser);
    });
  });

  describe('restoreOneById', () => {
    it('devrait restaurer une analyse par son ID', async () => {
      mockAnalysisService.restoreOneById.mockResolvedValue(undefined);
      const request = { user: mockUser };

      await controller.restoreOneById(mockAnalysis.id, request as never);

      expect(mockAnalysisService.restoreOneById).toHaveBeenCalledWith(mockAnalysis.id, mockUser);
    });
  });
});
