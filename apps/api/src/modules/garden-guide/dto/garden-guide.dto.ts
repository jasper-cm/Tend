import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] })
  @IsEnum(['user', 'assistant'])
  role!: 'user' | 'assistant';

  @ApiProperty()
  @IsString()
  content!: string;
}

export class ChatRequestDto {
  @ApiProperty({ example: 'How is my garden doing?' })
  @IsString()
  message!: string;

  @ApiPropertyOptional({ type: [ChatMessageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  history?: ChatMessageDto[];
}

export class ChatResponseDto {
  @ApiProperty()
  reply!: string;

  @ApiProperty()
  context!: {
    gardenHealth: number;
    activeStreaks: number;
    recentReflections: number;
  };
}

export class InsightDto {
  @ApiProperty({ enum: ['celebration', 'encouragement', 'suggestion', 'observation'] })
  type!: 'celebration' | 'encouragement' | 'suggestion' | 'observation';

  @ApiProperty()
  title!: string;

  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  lifeArea?: string;

  @ApiProperty({ enum: ['high', 'medium', 'low'] })
  priority!: 'high' | 'medium' | 'low';
}

export class InsightsResponseDto {
  @ApiProperty({ type: [InsightDto] })
  insights!: InsightDto[];

  @ApiProperty()
  summary!: string;
}
