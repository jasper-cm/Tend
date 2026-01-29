import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max, Matches } from 'class-validator';

/**
 * DTO for creating a new life area.
 */
export class CreateLifeAreaDto {
  @ApiProperty({ description: 'Display name for the life area', example: 'Health' })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'URL-friendly slug (lowercase, hyphens allowed)',
    example: 'health',
    pattern: '^[a-z0-9-]+$',
  })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase alphanumeric with hyphens' })
  slug!: string;

  @ApiProperty({ description: 'Brief description of this life area', example: 'Physical and mental wellbeing' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ description: 'Icon name from Ionicons', example: 'heart', default: 'leaf' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Hex color code', example: '#4a7c59', default: '#4a7c59' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'Color must be a valid hex code (e.g., #4a7c59)' })
  color?: string;

  @ApiProperty({ description: 'User ID who owns this life area' })
  @IsString()
  userId!: string;
}

/**
 * DTO for updating an existing life area.
 * All fields are optional.
 */
export class UpdateLifeAreaDto {
  @ApiPropertyOptional({ description: 'Display name for the life area', example: 'Health & Fitness' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Brief description of this life area' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Icon name from Ionicons', example: 'heart' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Hex color code', example: '#4a7c59' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'Color must be a valid hex code (e.g., #4a7c59)' })
  color?: string;

  @ApiPropertyOptional({ description: 'Current health score (0-100)', minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  healthScore?: number;
}
