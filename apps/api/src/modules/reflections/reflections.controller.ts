import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReflectionsService } from './reflections.service';

@ApiTags('Reflections')
@Controller('reflections')
export class ReflectionsController {
  constructor(private readonly reflectionsService: ReflectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reflections, optionally filtered by life area' })
  findAll(@Query('lifeAreaId') lifeAreaId?: string) {
    return this.reflectionsService.findAll(lifeAreaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific reflection' })
  findOne(@Param('id') id: string) {
    return this.reflectionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reflection entry' })
  create(@Body() data: any) {
    return this.reflectionsService.create(data);
  }
}
