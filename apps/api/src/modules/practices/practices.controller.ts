import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PracticesService } from './practices.service';

@ApiTags('Practices')
@Controller('practices')
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all practices' })
  findAll() {
    return this.practicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific practice with its log entries' })
  findOne(@Param('id') id: string) {
    return this.practicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new practice' })
  create(@Body() data: any) {
    return this.practicesService.create(data);
  }

  @Post(':id/log')
  @ApiOperation({ summary: 'Log a practice completion' })
  log(@Param('id') id: string, @Body() data: any) {
    return this.practicesService.log(id, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a practice' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.practicesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a practice' })
  remove(@Param('id') id: string) {
    return this.practicesService.remove(id);
  }
}
