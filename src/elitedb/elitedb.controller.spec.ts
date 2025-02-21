import { Test, TestingModule } from '@nestjs/testing';
import { ElitedbController } from './elitedb.controller';

describe('ElitedbController', () => {
  let controller: ElitedbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElitedbController],
    }).compile();

    controller = module.get<ElitedbController>(ElitedbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
