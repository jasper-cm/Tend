import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GardenGuideService } from './garden-guide.service';
import { ChatRequestDto, ChatResponseDto, InsightsResponseDto } from './dto/garden-guide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Garden Guide')
@Controller('garden-guide')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GardenGuideController {
  constructor(private readonly gardenGuideService: GardenGuideService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Send a message to the Garden Guide AI assistant' })
  @ApiBody({ type: ChatRequestDto })
  chat(
    @CurrentUser('id') userId: string,
    @Body() body: ChatRequestDto
  ): Promise<ChatResponseDto> {
    return this.gardenGuideService.chat(userId, body.message, body.history);
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get AI-generated insights about your life garden' })
  getInsights(@CurrentUser('id') userId: string): Promise<InsightsResponseDto> {
    return this.gardenGuideService.generateInsights(userId);
  }
}
