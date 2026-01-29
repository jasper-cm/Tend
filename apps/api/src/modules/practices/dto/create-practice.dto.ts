import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsBoolean, Min, IsIn } from 'class-validator';

/** Valid practice categories */
export const PRACTICE_CATEGORIES = ['habit', 'ritual', 'routine', 'exercise', 'meditation', 'learning'] as const;
export type PracticeCategory = (typeof PRACTICE_CATEGORIES)[number];

/** Valid practice frequencies */
export const PRACTICE_FREQUENCIES = ['daily', 'weekly', 'biweekly', 'monthly'] as const;
export type PracticeFrequency = (typeof PRACTICE_FREQUENCIES)[number];

/**
 * DTO for creating a new practice.
 */
export class CreatePracticeDto {
  @ApiProperty({ description: 'Practice name', example: 'Morning meditation' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'What this practice involves', example: '10 minutes of mindful breathing' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({
    description: 'Practice category',
    enum: PRACTICE_CATEGORIES,
    default: 'habit',
  })
  @IsOptional()
  @IsString()
  @IsIn(PRACTICE_CATEGORIES)
  category?: PracticeCategory;

  @ApiPropertyOptional({
    description: 'How often to practice',
    enum: PRACTICE_FREQUENCIES,
    default: 'daily',
  })
  @IsOptional()
  @IsString()
  @IsIn(PRACTICE_FREQUENCIES)
  frequency?: PracticeFrequency;

  @ApiPropertyOptional({ description: 'Expected duration in minutes', example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiProperty({ description: 'Life area this practice belongs to' })
  @IsString()
  lifeAreaId!: string;

  @ApiProperty({ description: 'User ID who owns this practice' })
  @IsString()
  userId!: string;
}

/**
 * DTO for updating an existing practice.
 */
export class UpdatePracticeDto {
  @ApiPropertyOptional({ description: 'Practice name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'What this practice involves' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Practice category', enum: PRACTICE_CATEGORIES })
  @IsOptional()
  @IsString()
  @IsIn(PRACTICE_CATEGORIES)
  category?: PracticeCategory;

  @ApiPropertyOptional({ description: 'How often to practice', enum: PRACTICE_FREQUENCIES })
  @IsOptional()
  @IsString()
  @IsIn(PRACTICE_FREQUENCIES)
  frequency?: PracticeFrequency;

  @ApiPropertyOptional({ description: 'Expected duration in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ description: 'Whether this practice is currently active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * DTO for logging a practice completion.
 */
export class LogPracticeDto {
  @ApiPropertyOptional({ description: 'Actual duration in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ description: 'Notes about this session' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Quality rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quality?: number;
}
