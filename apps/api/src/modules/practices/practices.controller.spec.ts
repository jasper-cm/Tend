import { Test, TestingModule } from '@nestjs/testing';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

describe('PracticesController', () => {
  let controller: PracticesController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    log: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticesController],
      providers: [{ provide: PracticesService, useValue: mockService }],
    }).compile();

    controller = module.get<PracticesController>(PracticesController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', async () => {
      const expected = [{ id: '1', name: 'Meditate' }];
      mockService.findAll.mockResolvedValue(expected);
      await expect(controller.findAll()).resolves.toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne with id', async () => {
      const expected = { id: '1', name: 'Meditate', logs: [] };
      mockService.findOne.mockResolvedValue(expected);
      await expect(controller.findOne('1')).resolves.toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const data = { name: 'Exercise', lifeAreaId: '1' };
      mockService.create.mockResolvedValue({ id: '2', ...data });
      await expect(controller.create(data)).resolves.toEqual({ id: '2', ...data });
      expect(mockService.create).toHaveBeenCalledWith(data);
    });
  });

  describe('log', () => {
    it('should delegate to service.log with practice id and data', async () => {
      const data = { notes: 'Great session' };
      mockService.log.mockResolvedValue({ id: 'log-1', practiceId: '1', ...data });
      await expect(controller.log('1', data)).resolves.toEqual({ id: 'log-1', practiceId: '1', ...data });
      expect(mockService.log).toHaveBeenCalledWith('1', data);
    });
  });

  describe('update', () => {
    it('should delegate to service.update', async () => {
      const data = { name: 'Updated' };
      mockService.update.mockResolvedValue({ id: '1', ...data });
      await expect(controller.update('1', data)).resolves.toEqual({ id: '1', ...data });
      expect(mockService.update).toHaveBeenCalledWith('1', data);
    });
  });

  describe('remove', () => {
    it('should delegate to service.remove', async () => {
      mockService.remove.mockResolvedValue({ id: '1' });
      await expect(controller.remove('1')).resolves.toEqual({ id: '1' });
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });
});
