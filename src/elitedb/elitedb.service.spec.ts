import { Test, TestingModule } from '@nestjs/testing';
import { ElitedbService } from './elitedb.service';

describe('ElitedbService', () => {
  let service: ElitedbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: 'elitedb_ElitedbMoveRepository', useValue: {} }, ElitedbService],
    }).compile();

    service = module.get<ElitedbService>(ElitedbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
