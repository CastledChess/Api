import { Test, TestingModule } from '@nestjs/testing';
import { ElitedbController } from './elitedb.controller';
import { ElitedbService } from './elitedb.service';

describe('ElitedbController', () => {
  let controller: ElitedbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElitedbController],
      providers: [{ provide: ElitedbService, useValue: {} }],
    }).compile();

    controller = module.get<ElitedbController>(ElitedbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
