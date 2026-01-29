import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PracticesService', () => {
  let service: PracticesService;

  const mockPrisma = {
    practice: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    practiceLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PracticesService>(PracticesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return practices with life areas ordered by name', async () => {
      const expected = [{ id: '1', name: 'Meditate', lifeArea: {} }];
      mockPrisma.practice.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.practice.findMany).toHaveBeenCalledWith({
        include: { lifeArea: true },
        orderBy: [{ lifeArea: { name: 'asc' } }, { name: 'asc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return a practice with life area and recent logs', async () => {
      const expected = { id: '1', name: 'Meditate', lifeArea: {}, logs: [] };
      mockPrisma.practice.findUnique.mockResolvedValue(expected);
      const result = await service.findOne('1');
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException if practice not found', async () => {
      mockPrisma.practice.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a practice', async () => {
      const data = {
        name: 'Exercise',
        description: 'Daily workout',
        lifeAreaId: 'area-1',
        userId: 'user-1',
      };
      const created = { id: '2', ...data, lifeArea: {} };
      mockPrisma.practice.create.mockResolvedValue(created);
      const result = await service.create(data);
      expect(result).toEqual(created);
    });
  });

  describe('log', () => {
    it('should create a practice log entry', async () => {
      const data = { notes: 'Good session' };
      mockPrisma.practice.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.practiceLog.create.mockResolvedValue({ id: 'log-1', practiceId: '1', ...data });

      const result = await service.log('1', data);
      expect(result).toEqual({ id: 'log-1', practiceId: '1', ...data });
    });

    it('should throw NotFoundException if practice not found', async () => {
      mockPrisma.practice.findUnique.mockResolvedValue(null);
      await expect(service.log('nonexistent', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a practice', async () => {
      const data = { name: 'Updated' };
      const updated = { id: '1', ...data, lifeArea: {} };
      mockPrisma.practice.update.mockResolvedValue(updated);
      const result = await service.update('1', data);
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if practice not found', async () => {
      mockPrisma.practice.update.mockRejectedValue({ code: 'P2025' });
      await expect(service.update('nonexistent', { name: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a practice', async () => {
      mockPrisma.practice.delete.mockResolvedValue({ id: '1' });
      const result = await service.remove('1');
      expect(result).toEqual({ id: '1' });
    });

    it('should throw NotFoundException if practice not found', async () => {
      mockPrisma.practice.delete.mockRejectedValue({ code: 'P2025' });
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
