import { Test, TestingModule } from '@nestjs/testing';
import { ReflectionsController } from './reflections.controller';
import { ReflectionsService } from './reflections.service';

describe('ReflectionsController', () => {
  let controller: ReflectionsController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReflectionsController],
      providers: [{ provide: ReflectionsService, useValue: mockService }],
    }).compile();

    controller = module.get<ReflectionsController>(ReflectionsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll without filter', async () => {
      const expected = [{ id: '1', title: 'Morning thoughts', content: 'Feeling great' }];
      mockService.findAll.mockResolvedValue(expected);
      await expect(controller.findAll()).resolves.toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should delegate to service.findAll with lifeAreaId filter', async () => {
      const expected = [{ id: '1', title: 'Health check', content: 'Health reflection' }];
      mockService.findAll.mockResolvedValue(expected);
      await expect(controller.findAll('area-1')).resolves.toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalledWith('area-1');
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne with id', async () => {
      const expected = { id: '1', title: 'A reflection', content: 'Content here' };
      mockService.findOne.mockResolvedValue(expected);
      await expect(controller.findOne('1')).resolves.toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const data = {
        title: 'New reflection',
        content: 'Reflection content',
        mood: 'good' as const,
        userId: 'user-1',
      };
      mockService.create.mockResolvedValue({ id: '2', ...data });
      await expect(controller.create(data)).resolves.toEqual({ id: '2', ...data });
      expect(mockService.create).toHaveBeenCalledWith(data);
    });
  });

  describe('update', () => {
    it('should delegate to service.update with id and data', async () => {
      const data = { title: 'Updated title' };
      mockService.update.mockResolvedValue({ id: '1', ...data });
      await expect(controller.update('1', data)).resolves.toEqual({ id: '1', ...data });
      expect(mockService.update).toHaveBeenCalledWith('1', data);
    });
  });

  describe('remove', () => {
    it('should delegate to service.remove with id', async () => {
      mockService.remove.mockResolvedValue({ id: '1' });
      await expect(controller.remove('1')).resolves.toEqual({ id: '1' });
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });
});
