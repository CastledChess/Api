import { Test, TestingModule } from '@nestjs/testing';
import { ChessController } from './chess.controller';
import { ChessService } from './chess.service';

describe('ChessController', () => {
  let controller: ChessController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ChessController],
      providers: [
        {
          provide: ChessService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ChessController>(ChessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
