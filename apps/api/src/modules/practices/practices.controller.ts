import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { PracticesService } from './practices.service';
import { CreatePracticeDto, UpdatePracticeDto, LogPracticeDto } from './dto/create-practice.dto';

/**
 * Controller for managing practices (habits, routines, rituals).
 *
 * Practices are the actionable items within a life area that users
 * commit to doing regularly to nurture that area of their life.
 */
@ApiTags('Practices')
@Controller('practices')
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all practices with their life areas' })
  findAll() {
    return this.practicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific practice with its recent log entries' })
  @ApiParam({ name: 'id', description: 'Practice ID' })
  findOne(@Param('id') id: string) {
    return this.practicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new practice' })
  @ApiBody({ type: CreatePracticeDto })
  create(@Body() data: CreatePracticeDto) {
    return this.practicesService.create(data);
  }

  @Post(':id/log')
  @ApiOperation({ summary: 'Log a practice completion' })
  @ApiParam({ name: 'id', description: 'Practice ID' })
  @ApiBody({ type: LogPracticeDto })
  log(@Param('id') id: string, @Body() data: LogPracticeDto) {
    return this.practicesService.log(id, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a practice' })
  @ApiParam({ name: 'id', description: 'Practice ID' })
  @ApiBody({ type: UpdatePracticeDto })
  update(@Param('id') id: string, @Body() data: UpdatePracticeDto) {
    return this.practicesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a practice and all its log entries' })
  @ApiParam({ name: 'id', description: 'Practice ID' })
  remove(@Param('id') id: string) {
    return this.practicesService.remove(id);
  }
}
