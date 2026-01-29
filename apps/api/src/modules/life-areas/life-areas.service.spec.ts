import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LifeAreasService } from './life-areas.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('LifeAreasService', () => {
  let service: LifeAreasService;

  const mockPrisma = {
    lifeArea: {
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
        LifeAreasService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LifeAreasService>(LifeAreasService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all life areas with practices included', async () => {
      const expected = [{ id: '1', name: 'Health', practices: [] }];
      mockPrisma.lifeArea.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.lifeArea.findMany).toHaveBeenCalledWith({
        include: { practices: true },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a life area with practices and reflections', async () => {
      const expected = { id: '1', name: 'Health', practices: [], reflections: [] };
      mockPrisma.lifeArea.findUnique.mockResolvedValue(expected);
      const result = await service.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException if life area not found', async () => {
      mockPrisma.lifeArea.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new life area', async () => {
      const data = {
        name: 'Career',
        slug: 'career',
        description: 'Professional growth',
        userId: 'user-1',
      };
      mockPrisma.lifeArea.create.mockResolvedValue({ id: '2', ...data });
      const result = await service.create(data);
      expect(result).toEqual({ id: '2', ...data });
    });
  });

  describe('update', () => {
    it('should update a life area by id', async () => {
      const data = { name: 'Updated' };
      mockPrisma.lifeArea.update.mockResolvedValue({ id: '1', ...data });
      const result = await service.update('1', data);
      expect(result).toEqual({ id: '1', ...data });
      expect(mockPrisma.lifeArea.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data,
      });
    });

    it('should throw NotFoundException if life area not found', async () => {
      mockPrisma.lifeArea.update.mockRejectedValue({ code: 'P2025' });
      await expect(service.update('nonexistent', { name: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a life area by id', async () => {
      mockPrisma.lifeArea.delete.mockResolvedValue({ id: '1' });
      const result = await service.remove('1');
      expect(result).toEqual({ id: '1' });
      expect(mockPrisma.lifeArea.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if life area not found', async () => {
      mockPrisma.lifeArea.delete.mockRejectedValue({ code: 'P2025' });
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
