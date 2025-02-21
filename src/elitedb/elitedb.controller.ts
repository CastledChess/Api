import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ElitedbService } from './elitedb.service';
import { ApiProperty } from '@nestjs/swagger';

@Controller('elitedb')
export class ElitedbController {
  constructor(private readonly elitedbService: ElitedbService) {}
  @Get()
  @ApiProperty({
    description: 'Get moves for a given FEN position',
    required: true,
    type: String,
    example: '/elitedb?fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq -',
  })
  async getMoves(@Query('fen') fen: string) {
    if (!fen) {
      throw new BadRequestException("Missing query param 'fen'");
    }
    const splitFen = fen.split(' ');
    const sanitizedFen = `${splitFen[0]} ${splitFen[2]} ${splitFen[3]}`;

    const moves = await this.elitedbService.findMoves(sanitizedFen);
    return moves;
  }
}
