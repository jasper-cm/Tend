import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ReflectionsService } from './reflections.service';
import { CreateReflectionDto, UpdateReflectionDto } from './dto/create-reflection.dto';

/**
 * Controller for managing reflections (journal entries).
 *
 * Reflections are journal entries where users record their thoughts,
 * gratitude, mood, and insights related to their life areas.
 */
@ApiTags('Reflections')
@Controller('reflections')
export class ReflectionsController {
  constructor(private readonly reflectionsService: ReflectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reflections, optionally filtered by life area' })
  @ApiQuery({ name: 'lifeAreaId', required: false, description: 'Filter by life area ID' })
  findAll(@Query('lifeAreaId') lifeAreaId?: string) {
    return this.reflectionsService.findAll(lifeAreaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific reflection with its linked life areas' })
  @ApiParam({ name: 'id', description: 'Reflection ID' })
  findOne(@Param('id') id: string) {
    return this.reflectionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reflection entry' })
  @ApiBody({ type: CreateReflectionDto })
  create(@Body() data: CreateReflectionDto) {
    return this.reflectionsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reflection' })
  @ApiParam({ name: 'id', description: 'Reflection ID' })
  @ApiBody({ type: UpdateReflectionDto })
  update(@Param('id') id: string, @Body() data: UpdateReflectionDto) {
    return this.reflectionsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a reflection' })
  @ApiParam({ name: 'id', description: 'Reflection ID' })
  remove(@Param('id') id: string) {
    return this.reflectionsService.remove(id);
  }
}
