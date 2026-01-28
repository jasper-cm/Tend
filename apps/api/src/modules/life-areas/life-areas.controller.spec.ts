import { Test, TestingModule } from '@nestjs/testing';
import { LifeAreasController } from './life-areas.controller';
import { LifeAreasService } from './life-areas.service';

describe('LifeAreasController', () => {
  let controller: LifeAreasController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifeAreasController],
      providers: [{ provide: LifeAreasService, useValue: mockService }],
    }).compile();

    controller = module.get<LifeAreasController>(LifeAreasController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', async () => {
      const expected = [{ id: '1', name: 'Health' }];
      mockService.findAll.mockResolvedValue(expected);
      await expect(controller.findAll()).resolves.toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne with the id', async () => {
      const expected = { id: '1', name: 'Health' };
      mockService.findOne.mockResolvedValue(expected);
      await expect(controller.findOne('1')).resolves.toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should delegate to service.create with data', async () => {
      const data = { name: 'Career', slug: 'career' };
      mockService.create.mockResolvedValue({ id: '2', ...data });
      await expect(controller.create(data)).resolves.toEqual({ id: '2', ...data });
      expect(mockService.create).toHaveBeenCalledWith(data);
    });
  });

  describe('update', () => {
    it('should delegate to service.update with id and data', async () => {
      const data = { name: 'Updated' };
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
