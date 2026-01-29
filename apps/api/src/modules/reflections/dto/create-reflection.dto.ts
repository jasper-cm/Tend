import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';

/** Valid reflection types */
export const REFLECTION_TYPES = ['freeform', 'gratitude', 'weekly-review', 'monthly-review', 'goal-setting'] as const;
export type ReflectionType = (typeof REFLECTION_TYPES)[number];

/** Valid mood options */
export const MOODS = ['great', 'good', 'okay', 'low', 'struggling'] as const;
export type Mood = (typeof MOODS)[number];

/**
 * DTO for creating a new reflection.
 */
export class CreateReflectionDto {
  @ApiPropertyOptional({
    description: 'Type of reflection',
    enum: REFLECTION_TYPES,
    default: 'freeform',
  })
  @IsOptional()
  @IsString()
  @IsIn(REFLECTION_TYPES)
  type?: ReflectionType;

  @ApiProperty({ description: 'Reflection title', example: 'Morning thoughts' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Main reflection content', example: 'Today I realized...' })
  @IsString()
  content!: string;

  @ApiPropertyOptional({ description: 'Current mood', enum: MOODS })
  @IsOptional()
  @IsString()
  @IsIn(MOODS)
  mood?: Mood;

  @ApiPropertyOptional({
    description: 'List of things to be grateful for',
    type: [String],
    example: ['Good health', 'Supportive family'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gratitude?: string[];

  @ApiPropertyOptional({
    description: 'Key insights or realizations',
    type: [String],
    example: ['I work better in the morning'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  insights?: string[];

  @ApiProperty({ description: 'User ID who created this reflection' })
  @IsString()
  userId!: string;

  @ApiPropertyOptional({
    description: 'Life area IDs this reflection relates to',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lifeAreaIds?: string[];
}

/**
 * DTO for updating an existing reflection.
 */
export class UpdateReflectionDto {
  @ApiPropertyOptional({ description: 'Reflection title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Main reflection content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Current mood', enum: MOODS })
  @IsOptional()
  @IsString()
  @IsIn(MOODS)
  mood?: Mood;

  @ApiPropertyOptional({ description: 'List of things to be grateful for', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gratitude?: string[];

  @ApiPropertyOptional({ description: 'Key insights or realizations', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  insights?: string[];
}
