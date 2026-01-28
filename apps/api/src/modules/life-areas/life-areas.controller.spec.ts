import { Test, TestingModule } from '@nestjs/testing';
import { LifeAreasController } from './life-areas.controller';
import { LifeAreasService } from './life-areas.service';

describe('LifeAreasController', () => {
  let controller: LifeAreasController;
  let service: jest.Mocked<LifeAreasService>;

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
    service = module.get(LifeAreasService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', () => {
      const expected = [{ id: '1', name: 'Health' }];
      mockService.findAll.mockReturnValue(expected);
      expect(controller.findAll()).toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne with the id', () => {
      const expected = { id: '1', name: 'Health' };
      mockService.findOne.mockReturnValue(expected);
      expect(controller.findOne('1')).toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should delegate to service.create with data', () => {
      const data = { name: 'Career', slug: 'career' };
      mockService.create.mockReturnValue({ id: '2', ...data });
      expect(controller.create(data)).toEqual({ id: '2', ...data });
      expect(mockService.create).toHaveBeenCalledWith(data);
    });
  });

  describe('update', () => {
    it('should delegate to service.update with id and data', () => {
      const data = { name: 'Updated' };
      mockService.update.mockReturnValue({ id: '1', ...data });
      expect(controller.update('1', data)).toEqual({ id: '1', ...data });
      expect(mockService.update).toHaveBeenCalledWith('1', data);
    });
  });

  describe('remove', () => {
    it('should delegate to service.remove with id', () => {
      mockService.remove.mockReturnValue({ id: '1' });
      expect(controller.remove('1')).toEqual({ id: '1' });
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });
});
