import { Test, TestingModule } from '@nestjs/testing';
import { ReflectionsService } from './reflections.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ReflectionsService', () => {
  let service: ReflectionsService;

  const mockPrisma = {
    reflection: {
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
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
      const expected = [{ id: '1', content: 'Good day' }];
      mockPrisma.reflection.findMany.mockResolvedValue(expected);
      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(mockPrisma.reflection.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: { lifeArea: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by lifeAreaId when provided', async () => {
      mockPrisma.reflection.findMany.mockResolvedValue([]);
      await service.findAll('area-1');
      expect(mockPrisma.reflection.findMany).toHaveBeenCalledWith({
        where: { lifeAreaId: 'area-1' },
        include: { lifeArea: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a reflection with its life area', async () => {
      const expected = { id: '1', content: 'Good day', lifeArea: {} };
      mockPrisma.reflection.findUniqueOrThrow.mockResolvedValue(expected);
      const result = await service.findOne('1');
      expect(result).toEqual(expected);
      expect(mockPrisma.reflection.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { lifeArea: true },
      });
    });
  });

  describe('create', () => {
    it('should create a new reflection', async () => {
      const data = { content: 'New reflection', mood: 'grateful' };
      mockPrisma.reflection.create.mockResolvedValue({ id: '2', ...data });
      const result = await service.create(data);
      expect(result).toEqual({ id: '2', ...data });
      expect(mockPrisma.reflection.create).toHaveBeenCalledWith({ data });
    });
  });
});
