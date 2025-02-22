import { BadRequestException, Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ElitedbService } from './elitedb.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('elitedb')
export class ElitedbController {
  constructor(private readonly elitedbService: ElitedbService) {}
  @Get()
  @ApiQuery({
    name: 'fen',
    type: String,
    description: 'La position FEN',
    required: true,
    example: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    schema: {
      default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMoves(@Query('fen') fen: string) {
    if (!fen) {
      throw new BadRequestException("Missing query param 'fen'");
    }
    const splitFen = fen.split(' ');
    const sanitizedFen = `${splitFen[0]} ${splitFen[2]} ${splitFen[3]}`;
    console.log(sanitizedFen);

    const moves = await this.elitedbService.findMoves(sanitizedFen);
    return moves;
  }
}
