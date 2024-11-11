import { PartialType } from '@nestjs/swagger';
import { CreateLichessStrategyDto } from './create-lichess-strategy.dto';

export class UpdateLichessStrategyDto extends PartialType(CreateLichessStrategyDto) {}
