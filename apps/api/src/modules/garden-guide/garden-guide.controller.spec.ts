import { Test, TestingModule } from '@nestjs/testing';
import { GardenGuideController } from './garden-guide.controller';
import { GardenGuideService } from './garden-guide.service';

describe('GardenGuideController', () => {
  let controller: GardenGuideController;

  const mockService = {
    chat: jest.fn(),
    generateInsights: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GardenGuideController],
      providers: [{ provide: GardenGuideService, useValue: mockService }],
    }).compile();

    controller = module.get<GardenGuideController>(GardenGuideController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('chat', () => {
    it('should delegate to service.chat with userId and message', async () => {
      const userId = 'user-123';
      const body = { message: 'How is my garden doing?' };
      const expected = {
        reply: 'Your garden looks healthy!',
        context: { gardenHealth: 75, activeStreaks: 3, recentReflections: 2 },
      };
      mockService.chat.mockResolvedValue(expected);

      const result = await controller.chat(userId, body);

      expect(result).toEqual(expected);
      expect(mockService.chat).toHaveBeenCalledWith(userId, body.message, undefined);
    });
  });

  describe('getInsights', () => {
    it('should delegate to service.generateInsights with userId', async () => {
      const userId = 'user-123';
      const expected = {
        insights: [],
        summary: 'Your garden is growing steadily.',
      };
      mockService.generateInsights.mockResolvedValue(expected);

      const result = await controller.getInsights(userId);

      expect(result).toEqual(expected);
      expect(mockService.generateInsights).toHaveBeenCalledWith(userId);
    });
  });
});
