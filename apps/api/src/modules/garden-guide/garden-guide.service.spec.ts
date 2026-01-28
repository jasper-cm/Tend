import { Test, TestingModule } from '@nestjs/testing';
import { GardenGuideService } from './garden-guide.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('GardenGuideService', () => {
  let service: GardenGuideService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GardenGuideService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GardenGuideService>(GardenGuideService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chat', () => {
    it('should return a placeholder reply', async () => {
      const result = await service.chat({ text: 'Hello' });
      expect(result).toHaveProperty('reply');
      expect(typeof result.reply).toBe('string');
    });
  });

  describe('generateInsights', () => {
    it('should return insights structure', async () => {
      const result = await service.generateInsights();
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('message');
      expect(Array.isArray(result.insights)).toBe(true);
    });
  });
});
