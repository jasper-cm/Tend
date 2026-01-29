import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLifeAreaDto, UpdateLifeAreaDto } from './dto/create-life-area.dto';

/** Check if error is a Prisma "record not found" error */
function isPrismaNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2025'
  );
}

/**
 * Service for managing life areas.
 *
 * Handles CRUD operations for life areas and their relationships
 * with practices and reflections.
 */
@Injectable()
export class LifeAreasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all life areas with their associated practices.
   */
  findAll() {
    return this.prisma.lifeArea.findMany({
      include: { practices: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get a single life area by ID with full details.
   *
   * @throws NotFoundException if life area doesn't exist
   */
  async findOne(id: string) {
    const lifeArea = await this.prisma.lifeArea.findUnique({
      where: { id },
      include: {
        practices: {
          orderBy: { name: 'asc' },
        },
        reflections: {
          include: { reflection: true },
          orderBy: { reflection: { createdAt: 'desc' } },
          take: 10,
        },
      },
    });

    if (!lifeArea) {
      throw new NotFoundException(`Life area with ID "${id}" not found`);
    }

    return lifeArea;
  }

  /**
   * Create a new life area.
   */
  create(data: CreateLifeAreaDto) {
    return this.prisma.lifeArea.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        userId: data.userId,
      },
    });
  }

  /**
   * Update an existing life area.
   *
   * @throws NotFoundException if life area doesn't exist
   */
  async update(id: string, data: UpdateLifeAreaDto) {
    try {
      return await this.prisma.lifeArea.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Life area with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove a life area.
   * Associated practices will be cascade deleted.
   *
   * @throws NotFoundException if life area doesn't exist
   */
  async remove(id: string) {
    try {
      return await this.prisma.lifeArea.delete({ where: { id } });
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Life area with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
