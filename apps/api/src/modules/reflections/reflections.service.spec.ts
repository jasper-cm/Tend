import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ReflectionsService } from './reflections.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ReflectionsService', () => {
  let service: ReflectionsService;

  const mockPrisma = {
    reflection: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReflectionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReflectionsService>(ReflectionsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all reflections ordered by createdAt desc', async () => {
      const expected = [{ id: '1', title: 'Good day', content: 'It was great' }];
      mockPrisma.reflection.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.reflection.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: { lifeAreas: { include: { lifeArea: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by lifeAreaId when provided', async () => {
      mockPrisma.reflection.findMany.mockResolvedValue([]);
      await service.findAll('area-1');
      expect(mockPrisma.reflection.findMany).toHaveBeenCalledWith({
        where: { lifeAreas: { some: { lifeAreaId: 'area-1' } } },
        include: { lifeAreas: { include: { lifeArea: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a reflection with its life areas', async () => {
      const expected = { id: '1', title: 'Good day', lifeAreas: [] };
      mockPrisma.reflection.findUnique.mockResolvedValue(expected);
      const result = await service.findOne('1');
      expect(result).toEqual(expected);
      expect(mockPrisma.reflection.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { lifeAreas: { include: { lifeArea: true } } },
      });
    });

    it('should throw NotFoundException if reflection not found', async () => {
      mockPrisma.reflection.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new reflection', async () => {
      const data = {
        title: 'Morning thoughts',
        content: 'New reflection content',
        mood: 'good' as const,
        userId: 'user-1',
      };
      const created = { id: '2', ...data, lifeAreas: [] };
      mockPrisma.reflection.create.mockResolvedValue(created);

      const result = await service.create(data);
      expect(result).toEqual(created);
    });

    it('should create reflection with life area associations', async () => {
      const data = {
        title: 'Health check',
        content: 'Felt great today',
        userId: 'user-1',
        lifeAreaIds: ['area-1', 'area-2'],
      };
      const created = { id: '3', title: data.title, lifeAreas: [] };
      mockPrisma.reflection.create.mockResolvedValue(created);

      await service.create(data);
      expect(mockPrisma.reflection.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: data.title,
            lifeAreas: {
              create: [{ lifeAreaId: 'area-1' }, { lifeAreaId: 'area-2' }],
            },
          }),
        })
      );
    });
  });

  describe('update', () => {
    it('should update an existing reflection', async () => {
      const data = { title: 'Updated title' };
      const updated = { id: '1', title: 'Updated title', lifeAreas: [] };
      mockPrisma.reflection.update.mockResolvedValue(updated);

      const result = await service.update('1', data);
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if reflection not found', async () => {
      mockPrisma.reflection.update.mockRejectedValue({ code: 'P2025' });
      await expect(service.update('nonexistent', { title: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a reflection', async () => {
      const deleted = { id: '1' };
      mockPrisma.reflection.delete.mockResolvedValue(deleted);

      const result = await service.remove('1');
      expect(result).toEqual(deleted);
    });

    it('should throw NotFoundException if reflection not found', async () => {
      mockPrisma.reflection.delete.mockRejectedValue({ code: 'P2025' });
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
