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
    it('should delegate to service.findAll', () => {
      const expected = [{ id: '1', name: 'Meditate' }];
      mockService.findAll.mockReturnValue(expected);
      expect(controller.findAll()).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne with id', () => {
      const expected = { id: '1', name: 'Meditate', logs: [] };
      mockService.findOne.mockReturnValue(expected);
      expect(controller.findOne('1')).toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should delegate to service.create', () => {
      const data = { name: 'Exercise', lifeAreaId: '1' };
      mockService.create.mockReturnValue({ id: '2', ...data });
      expect(controller.create(data)).toEqual({ id: '2', ...data });
      expect(mockService.create).toHaveBeenCalledWith(data);
    });
  });

  describe('log', () => {
    it('should delegate to service.log with practice id and data', () => {
      const data = { notes: 'Great session' };
      mockService.log.mockReturnValue({ id: 'log-1', practiceId: '1', ...data });
      expect(controller.log('1', data)).toEqual({ id: 'log-1', practiceId: '1', ...data });
      expect(mockService.log).toHaveBeenCalledWith('1', data);
    });
  });

  describe('update', () => {
    it('should delegate to service.update', () => {
      const data = { name: 'Updated' };
      mockService.update.mockReturnValue({ id: '1', ...data });
      expect(controller.update('1', data)).toEqual({ id: '1', ...data });
      expect(mockService.update).toHaveBeenCalledWith('1', data);
    });
  });

  describe('remove', () => {
    it('should delegate to service.remove', () => {
      mockService.remove.mockReturnValue({ id: '1' });
      expect(controller.remove('1')).toEqual({ id: '1' });
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });
});
