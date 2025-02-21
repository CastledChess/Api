import { Controller, Get, Param } from '@nestjs/common';
import { ChessService } from './chess.service';
import { ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('chess')
export class ChessController {
  constructor(private readonly chessService: ChessService) {}

  @ApiOperation({ summary: 'Récupère le profil d’un joueur par username' })
  @ApiParam({ name: 'username', description: 'Le pseudonyme du joueur (ex: "erik")' })
  @ApiResponse({ status: 200, description: 'Profil du joueur récupéré.' })
  @Get('player/:username')
  async getChessPlayer(@Param('username') username: string) {
    return this.chessService.getChessPlayer(username);
  }

  @ApiOperation({ summary: 'Récupère les parties en cours (“to-move”) pour un joueur' })
  @ApiParam({ name: 'username', description: 'Le pseudonyme du joueur (ex: "erik")' })
  @ApiResponse({ status: 200, description: 'Parties en cours récupérées.' })
  @Get('player/:username/games/to-move')
  async getPlayerGamesToMove(@Param('username') username: string) {
    return this.chessService.getPlayerGamesToMove(username);
  }

  @ApiOperation({ summary: 'Récupère la liste des archives disponibles pour un joueur' })
  @ApiResponse({ status: 200, description: 'Archives récupérées.' })
  @Get('player/:username/games')
  async getPlayerMonthlyGames(@Param('username') username: string) {
    return this.chessService.getPlayerGames(username);
  }
}
