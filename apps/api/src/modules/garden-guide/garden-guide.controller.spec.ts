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
    it('should delegate to service.chat with message', () => {
      const message = { text: 'How is my garden doing?' };
      const expected = { reply: 'Your garden looks healthy!' };
      mockService.chat.mockReturnValue(expected);
      expect(controller.chat(message)).toEqual(expected);
      expect(mockService.chat).toHaveBeenCalledWith(message);
    });
  });

  describe('getInsights', () => {
    it('should delegate to service.generateInsights', () => {
      const expected = { insights: [], message: 'No insights yet' };
      mockService.generateInsights.mockReturnValue(expected);
      expect(controller.getInsights()).toEqual(expected);
      expect(mockService.generateInsights).toHaveBeenCalled();
    });
  });
});
