import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GardenGuideService } from './garden-guide.service';

@ApiTags('Garden Guide')
@Controller('garden-guide')
export class GardenGuideController {
  constructor(private readonly gardenGuideService: GardenGuideService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Send a message to the Garden Guide AI assistant' })
  chat(@Body() message: any) {
    return this.gardenGuideService.chat(message);
  }

  @Post('insights')
  @ApiOperation({ summary: 'Get AI-generated insights about your life garden' })
  getInsights() {
    return this.gardenGuideService.generateInsights();
  }
}
