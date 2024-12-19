import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Vérification de l'état de santé du serveur" })
  @ApiResponse({ status: 200, description: 'Statut du serveur' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  @ApiResponse({ status: 503, description: 'Service indisponible' })
  @ApiResponse({ status: 504, description: "Délai d'attente dépassé" })
  @ApiResponse({ status: 429, description: 'Trop de requêtes' })
  @Get('health')
  getHealthCheck(): { status: string } {
    return this.appService.getHealthCheck();
  }
}
