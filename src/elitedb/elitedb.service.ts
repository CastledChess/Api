import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ElitedbMove } from './entities/elitedb-move.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class ElitedbService {
  constructor(
    @InjectRepository(ElitedbMove, 'elitedb')
    private readonly elitedbMoveRepository: Repository<ElitedbMove>,
  ) {}

  async findMoves(sanitizedFen: string) {
    return this.elitedbMoveRepository.find({
      where: { position: sanitizedFen },
    });
  }
}
