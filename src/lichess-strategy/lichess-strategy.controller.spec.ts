import { Test, TestingModule } from '@nestjs/testing';
import { LichessStrategyController } from './lichess-strategy.controller';
import { LichessStrategyService } from './lichess-strategy.service';

describe('LichessStrategyController', () => {
  let controller: LichessStrategyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LichessStrategyController],
      providers: [LichessStrategyService],
    }).compile();

    controller = module.get<LichessStrategyController>(LichessStrategyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
