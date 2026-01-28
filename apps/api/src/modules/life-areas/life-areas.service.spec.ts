import { Test, TestingModule } from '@nestjs/testing';
import { LifeAreasService } from './life-areas.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('LifeAreasService', () => {
  let service: LifeAreasService;

  const mockPrisma = {
    lifeArea: {
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
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
      });
    });
  });

  describe('findOne', () => {
    it('should return a life area with practices and reflections', async () => {
      const expected = { id: '1', name: 'Health', practices: [], reflections: [] };
      mockPrisma.lifeArea.findUniqueOrThrow.mockResolvedValue(expected);
      const result = await service.findOne('1');
      expect(result).toEqual(expected);
      expect(mockPrisma.lifeArea.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { practices: true, reflections: true },
      });
    });
  });

  describe('create', () => {
    it('should create a new life area', async () => {
      const data = { name: 'Career', slug: 'career' };
      mockPrisma.lifeArea.create.mockResolvedValue({ id: '2', ...data });
      const result = await service.create(data);
      expect(result).toEqual({ id: '2', ...data });
      expect(mockPrisma.lifeArea.create).toHaveBeenCalledWith({ data });
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
  });
});
