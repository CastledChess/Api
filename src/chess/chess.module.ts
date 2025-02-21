import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChessService } from './chess.service';
import { ChessController } from './chess.controller';

@Module({
  imports: [HttpModule],
  providers: [ChessService],
  controllers: [ChessController],
  exports: [ChessService],
})
export class ChessModule {}
