import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePracticeDto, UpdatePracticeDto, LogPracticeDto } from './dto/create-practice.dto';

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
 * Service for managing practices and practice logs.
 *
 * Handles CRUD operations for practices and logging completions.
 */
@Injectable()
export class PracticesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all practices with their associated life areas.
   */
  findAll() {
    return this.prisma.practice.findMany({
      include: { lifeArea: true },
      orderBy: [{ lifeArea: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  /**
   * Get a single practice by ID with recent log entries.
   *
   * @throws NotFoundException if practice doesn't exist
   */
  async findOne(id: string) {
    const practice = await this.prisma.practice.findUnique({
      where: { id },
      include: {
        lifeArea: true,
        logs: {
          orderBy: { completedAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!practice) {
      throw new NotFoundException(`Practice with ID "${id}" not found`);
    }

    return practice;
  }

  /**
   * Create a new practice.
   */
  create(data: CreatePracticeDto) {
    return this.prisma.practice.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        frequency: data.frequency,
        durationMinutes: data.durationMinutes,
        lifeAreaId: data.lifeAreaId,
        userId: data.userId,
      },
      include: { lifeArea: true },
    });
  }

  /**
   * Log a practice completion.
   *
   * @throws NotFoundException if practice doesn't exist
   */
  async log(practiceId: string, data: LogPracticeDto) {
    // Verify practice exists
    const practice = await this.prisma.practice.findUnique({
      where: { id: practiceId },
    });

    if (!practice) {
      throw new NotFoundException(`Practice with ID "${practiceId}" not found`);
    }

    return this.prisma.practiceLog.create({
      data: {
        practiceId,
        durationMinutes: data.durationMinutes,
        notes: data.notes,
        quality: data.quality,
      },
    });
  }

  /**
   * Update an existing practice.
   *
   * @throws NotFoundException if practice doesn't exist
   */
  async update(id: string, data: UpdatePracticeDto) {
    try {
      return await this.prisma.practice.update({
        where: { id },
        data,
        include: { lifeArea: true },
      });
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Practice with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove a practice.
   * Associated logs will be cascade deleted.
   *
   * @throws NotFoundException if practice doesn't exist
   */
  async remove(id: string) {
    try {
      return await this.prisma.practice.delete({ where: { id } });
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Practice with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
