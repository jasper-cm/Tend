import { Test, TestingModule } from '@nestjs/testing';
import { ReflectionsController } from './reflections.controller';
import { ReflectionsService } from './reflections.service';

describe('ReflectionsController', () => {
  let controller: ReflectionsController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
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
    it('should delegate to service.findAll without filter', () => {
      const expected = [{ id: '1', content: 'Feeling great' }];
      mockService.findAll.mockReturnValue(expected);
      expect(controller.findAll()).toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should delegate to service.findAll with lifeAreaId filter', () => {
      const expected = [{ id: '1', content: 'Health reflection' }];
      mockService.findAll.mockReturnValue(expected);
      expect(controller.findAll('area-1')).toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalledWith('area-1');
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne with id', () => {
      const expected = { id: '1', content: 'A reflection' };
      mockService.findOne.mockReturnValue(expected);
      expect(controller.findOne('1')).toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should delegate to service.create', () => {
      const data = { content: 'New reflection', mood: 'grateful' };
      mockService.create.mockReturnValue({ id: '2', ...data });
      expect(controller.create(data)).toEqual({ id: '2', ...data });
      expect(mockService.create).toHaveBeenCalledWith(data);
    });
  });
});
