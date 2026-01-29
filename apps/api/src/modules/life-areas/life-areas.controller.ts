import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { LifeAreasService } from './life-areas.service';
import { CreateLifeAreaDto, UpdateLifeAreaDto } from './dto/create-life-area.dto';

/**
 * Controller for managing life areas (dimensions of personal development).
 *
 * Life areas represent different aspects of a user's life they want to nurture,
 * such as Health, Relationships, Career, Mind, etc.
 */
@ApiTags('Life Areas')
@Controller('life-areas')
export class LifeAreasController {
  constructor(private readonly lifeAreasService: LifeAreasService) {}

  @Get()
  @ApiOperation({ summary: 'Get all life areas for the current user' })
  findAll() {
    return this.lifeAreasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific life area with its practices and reflections' })
  @ApiParam({ name: 'id', description: 'Life area ID' })
  findOne(@Param('id') id: string) {
    return this.lifeAreasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new life area' })
  @ApiBody({ type: CreateLifeAreaDto })
  create(@Body() data: CreateLifeAreaDto) {
    return this.lifeAreasService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a life area' })
  @ApiParam({ name: 'id', description: 'Life area ID' })
  @ApiBody({ type: UpdateLifeAreaDto })
  update(@Param('id') id: string, @Body() data: UpdateLifeAreaDto) {
    return this.lifeAreasService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a life area and all its associated practices' })
  @ApiParam({ name: 'id', description: 'Life area ID' })
  remove(@Param('id') id: string) {
    return this.lifeAreasService.remove(id);
  }
}
