import { Module } from '@nestjs/common';
import { ChessService } from './chess.service';
import { ChessController } from './chess.controller';

@Module({
  providers: [ChessService],
  controllers: [ChessController],
  exports: [ChessService],
})
export class ChessModule {}
