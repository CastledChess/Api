import { LichessAuthGuard } from './lichess-auth.guard';

describe('LichessAuthGuard', () => {
  it('should be defined', () => {
    expect(new LichessAuthGuard()).toBeDefined();
  });
});
