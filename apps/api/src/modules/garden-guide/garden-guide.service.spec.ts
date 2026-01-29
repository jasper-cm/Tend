import { Test, TestingModule } from '@nestjs/testing';
import { GardenGuideService } from './garden-guide.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('GardenGuideService', () => {
  let service: GardenGuideService;

  const mockPrisma = {
    lifeArea: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    reflection: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GardenGuideService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GardenGuideService>(GardenGuideService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chat', () => {
    it('should return a reply with context', async () => {
      const userId = 'user-123';
      const message = 'Hello, how is my garden?';

      const result = await service.chat(userId, message);

      expect(result).toHaveProperty('reply');
      expect(result).toHaveProperty('context');
      expect(typeof result.reply).toBe('string');
      expect(result.context).toHaveProperty('gardenHealth');
      expect(result.context).toHaveProperty('activeStreaks');
      expect(result.context).toHaveProperty('recentReflections');
    });
  });

  describe('generateInsights', () => {
    it('should return insights and summary', async () => {
      const userId = 'user-123';

      const result = await service.generateInsights(userId);

      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('summary');
      expect(Array.isArray(result.insights)).toBe(true);
      expect(typeof result.summary).toBe('string');
    });
  });
});
