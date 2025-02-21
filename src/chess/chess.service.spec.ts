import { Test, TestingModule } from '@nestjs/testing';
import { ChessService } from './chess.service';
import { HttpModule } from '@nestjs/axios';

describe('ChessService', () => {
  let service: ChessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ChessService],
    }).compile();

    service = module.get<ChessService>(ChessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
