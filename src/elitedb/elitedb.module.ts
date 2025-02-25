import { Module } from '@nestjs/common';
import { ElitedbService } from './elitedb.service';
import { ElitedbController } from './elitedb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElitedbMove } from './entities/elitedb-move.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ElitedbMove], 'elitedb')],
  providers: [ElitedbService],
  controllers: [ElitedbController],
})
export class ElitedbModule {}
