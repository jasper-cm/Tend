import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LifeAreasService } from './life-areas.service';

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
  @ApiOperation({ summary: 'Get a specific life area with its current health' })
  findOne(@Param('id') id: string) {
    return this.lifeAreasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new life area' })
  create(@Body() data: any) {
    return this.lifeAreasService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a life area' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.lifeAreasService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a life area' })
  remove(@Param('id') id: string) {
    return this.lifeAreasService.remove(id);
  }
}
