import { Test, TestingModule } from '@nestjs/testing';
import { LichessStrategyService } from './lichess-strategy.service';

describe('LichessStrategyService', () => {
  let service: LichessStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LichessStrategyService],
    }).compile();

    service = module.get<LichessStrategyService>(LichessStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
