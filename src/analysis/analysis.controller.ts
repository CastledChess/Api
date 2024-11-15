import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/request/create-analysis.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { User } from '../users/user.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Analysis } from './entities/analysis.entity';

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

  @ApiOperation({ summary: 'Get analyses with pagination and sorting' })
  @ApiResponse({ status: 200, description: 'Analyses retrieved successfully.' })
  @Get()
  async findAllByUserId(
    @Req() request: Request & { user: User },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Analysis>> {
    const options: IPaginationOptions = { page, limit };
    return this.analysisService.findAllByUserId(request.user.id, options);
  }
}
