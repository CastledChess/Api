import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ChessPlayer } from './interfaces/chess-player.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ChessService {
  private readonly logger = new Logger(ChessService.name);
  private readonly BASE_URL = 'https://api.chess.com/pub';

  constructor(private readonly http: HttpService) {}

  /**
   * Récupère le profil d’un joueur par username
   * @param username Le pseudonyme du joueur (ex: 'erik')
   */
  async getChessPlayer(username: string): Promise<ChessPlayer> {
    try {
      const url = `${this.BASE_URL}/player/${username}`;
      const response$ = this.http.get<ChessPlayer>(url);
      const { data } = await lastValueFrom(response$);
      return data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération du profil du joueur: ${error}`);
      throw error;
    }
  }

  /**
   * Récupère les parties en cours (“to-move”) pour un joueur
   */
  async getPlayerGamesToMove(username: string) {
    try {
      const url = `${this.BASE_URL}/player/${username}/games/to-move`;
      const response$ = this.http.get(url);
      const { data } = await lastValueFrom(response$);
      return data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des parties en cours pour ${username}: ${error}`);
      throw error;
    }
  }

  async getPlayerGamesMonthly(username: string, year: number, month: number) {
    try {
      const url = `${this.BASE_URL}/player/${username}/games/${year}/${month}`;
      const response$ = this.http.get(url);
      const { data } = await lastValueFrom(response$);
      return data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des parties mensuelles pour ${username}: ${error}`);
      throw error;
    }
  }

  /**
   * Récupère la liste des archives disponibles pour un joueur (url des endpoints mensuels).
   */
  async getPlayerGameArchives(username: string) {
    try {
      const url = `${this.BASE_URL}/player/${username}/games/archives`;
      const response$ = this.http.get(url);
      const { data } = await lastValueFrom(response$);
      return data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des archives de ${username}: ${error}`);
      throw error;
    }
  }

  /**
   * Récupère les parties d’un joueur
   */
  async getPlayerGames(username: string) {
    try {
      const url = `${this.BASE_URL}/player/${username}/games`;
      const response$ = this.http.get(url);
      const { data } = await lastValueFrom(response$);
      return data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des parties pour ${username} : ${error}`);
      throw error;
    }
  }
}
