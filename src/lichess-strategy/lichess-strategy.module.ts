import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LichessStrategyService } from './lichess-strategy.service';
import { LichessStrategyController } from './lichess-strategy.controller';

@Module({
  imports: [HttpModule],
  controllers: [LichessStrategyController],
  providers: [LichessStrategyService],
})
export class LichessStrategyModule {}
