import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/request/create-analysis.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Analysis } from './entities/analysis.entity';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../common/constants';
import { AnalysisResponseDto } from './dto/response/analysis-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiBearerAuth('access-token')
@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @ApiOperation({ summary: "Création d'une analyse" })
  @ApiBody({ type: CreateAnalysisDto })
  @ApiResponse({ status: 201, description: 'Analyse créée.' })
  @Post()
  async create(
    @Body() createAnalysisDto: CreateAnalysisDto,
    @Req() request: Request & { user: User },
  ): Promise<CreateAnalysisDto> {
    return this.analysisService.create(createAnalysisDto, request.user);
  }

  @ApiOperation({ summary: "Récupération des analyses de l'utilisateur connecté" })
  @ApiResponse({ status: 200, description: "Liste des analyses de l'utilisateur connecté." })
  @ApiQuery({ name: 'page', required: true, schema: { default: DEFAULT_PAGE_NUMBER } })
  @ApiQuery({ name: 'limit', required: true, schema: { default: DEFAULT_PAGE_SIZE } })
  @Get()
  async findPaginatedByUserId(
    @CurrentUser() user: User,
    @Query('page') page: number = DEFAULT_PAGE_NUMBER,
    @Query('limit') limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<Pagination<Analysis>> {
    const options: IPaginationOptions = { page, limit };
    return this.analysisService.findAllByUserId(user.id, options);
  }

  @ApiOperation({ summary: "Récupération d'une analyse avec ses coups par ID" })
  @ApiParam({
    name: 'id',
    required: true,
    description: "ID de l'analyse",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Tous les détails de l'analyse",
    type: AnalysisResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Vous ne pouvez pas accéder à cette analyse.' })
  @ApiResponse({ status: 404, description: 'Analyse non trouvée.' })
  @Get(':id')
  async findOneById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: Request & { user: User },
  ): Promise<AnalysisResponseDto> {
    return this.analysisService.findOneById(id, request.user);
  }

  @ApiOperation({ summary: "Suppression d'une analyse par ID" })
  @ApiParam({
    name: 'id',
    required: true,
    description: "ID de l'analyse",
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Analyse supprimée.' })
  @ApiResponse({ status: 403, description: 'Vous ne pouvez pas supprimer cette analyse.' })
  @ApiResponse({ status: 404, description: 'Analyse non trouvée.' })
  @Delete(':id/delete')
  @HttpCode(204)
  async deleteOneById(@Param('id', ParseUUIDPipe) id: string, @Req() request: Request & { user: User }): Promise<void> {
    return this.analysisService.deleteOneById(id, request.user);
  }

  @ApiOperation({ summary: 'Restaurer une analyse par ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: "ID de l'analyse",
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Analyse restaurée.' })
  @ApiResponse({ status: 403, description: 'Vous ne pouvez pas restaurer cette analyse.' })
  @ApiResponse({ status: 404, description: 'Analyse non trouvée.' })
  @Post(':id/restore')
  @HttpCode(204)
  async restoreOneById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: Request & { user: User },
  ): Promise<void> {
    return this.analysisService.restoreOneById(id, request.user);
  }
}
