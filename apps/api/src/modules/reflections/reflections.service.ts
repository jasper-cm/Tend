import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReflectionDto, UpdateReflectionDto } from './dto/create-reflection.dto';

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
 * Service for managing reflections (journal entries).
 *
 * Handles CRUD operations for reflections and their life area associations.
 */
@Injectable()
export class ReflectionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all reflections, optionally filtered by life area.
   */
  findAll(lifeAreaId?: string) {
    return this.prisma.reflection.findMany({
      where: lifeAreaId
        ? { lifeAreas: { some: { lifeAreaId } } }
        : undefined,
      include: {
        lifeAreas: {
          include: { lifeArea: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single reflection by ID with its linked life areas.
   *
   * @throws NotFoundException if reflection doesn't exist
   */
  async findOne(id: string) {
    const reflection = await this.prisma.reflection.findUnique({
      where: { id },
      include: {
        lifeAreas: {
          include: { lifeArea: true },
        },
      },
    });

    if (!reflection) {
      throw new NotFoundException(`Reflection with ID "${id}" not found`);
    }

    return reflection;
  }

  /**
   * Create a new reflection with optional life area associations.
   */
  async create(data: CreateReflectionDto) {
    const { lifeAreaIds, ...reflectionData } = data;

    return this.prisma.reflection.create({
      data: {
        type: reflectionData.type,
        title: reflectionData.title,
        content: reflectionData.content,
        mood: reflectionData.mood,
        gratitude: reflectionData.gratitude ?? [],
        insights: reflectionData.insights ?? [],
        userId: reflectionData.userId,
        lifeAreas: lifeAreaIds?.length
          ? {
              create: lifeAreaIds.map((lifeAreaId) => ({ lifeAreaId })),
            }
          : undefined,
      },
      include: {
        lifeAreas: {
          include: { lifeArea: true },
        },
      },
    });
  }

  /**
   * Update an existing reflection.
   *
   * @throws NotFoundException if reflection doesn't exist
   */
  async update(id: string, data: UpdateReflectionDto) {
    try {
      return await this.prisma.reflection.update({
        where: { id },
        data,
        include: {
          lifeAreas: {
            include: { lifeArea: true },
          },
        },
      });
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Reflection with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove a reflection.
   * Life area associations will be cascade deleted.
   *
   * @throws NotFoundException if reflection doesn't exist
   */
  async remove(id: string) {
    try {
      return await this.prisma.reflection.delete({ where: { id } });
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Reflection with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
