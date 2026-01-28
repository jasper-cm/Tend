import { Test, TestingModule } from '@nestjs/testing';
import { PracticesService } from './practices.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PracticesService', () => {
  let service: PracticesService;

  const mockPrisma = {
    practice: {
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
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
    it('should return practices with life areas', async () => {
      const expected = [{ id: '1', name: 'Meditate', lifeArea: {} }];
      mockPrisma.practice.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.practice.findMany).toHaveBeenCalledWith({
        include: { lifeArea: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a practice with life area and recent logs', async () => {
      const expected = { id: '1', name: 'Meditate', lifeArea: {}, logs: [] };
      mockPrisma.practice.findUniqueOrThrow.mockResolvedValue(expected);
      const result = await service.findOne('1');
      expect(result).toEqual(expected);
      expect(mockPrisma.practice.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { lifeArea: true, logs: { orderBy: { completedAt: 'desc' }, take: 30 } },
      });
    });
  });

  describe('create', () => {
    it('should create a practice', async () => {
      const data = { name: 'Exercise', lifeAreaId: '1' };
      mockPrisma.practice.create.mockResolvedValue({ id: '2', ...data });
      const result = await service.create(data);
      expect(result).toEqual({ id: '2', ...data });
      expect(mockPrisma.practice.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('log', () => {
    it('should create a practice log entry', async () => {
      const data = { notes: 'Good session' };
      mockPrisma.practiceLog.create.mockResolvedValue({ id: 'log-1', practiceId: '1', ...data });
      const result = await service.log('1', data);
      expect(result).toEqual({ id: 'log-1', practiceId: '1', ...data });
      expect(mockPrisma.practiceLog.create).toHaveBeenCalledWith({
        data: { ...data, practiceId: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update a practice', async () => {
      const data = { name: 'Updated' };
      mockPrisma.practice.update.mockResolvedValue({ id: '1', ...data });
      const result = await service.update('1', data);
      expect(result).toEqual({ id: '1', ...data });
    });
  });

  describe('remove', () => {
    it('should delete a practice', async () => {
      mockPrisma.practice.delete.mockResolvedValue({ id: '1' });
      const result = await service.remove('1');
      expect(result).toEqual({ id: '1' });
    });
  });
});
