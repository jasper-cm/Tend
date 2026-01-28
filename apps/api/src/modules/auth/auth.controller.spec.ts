import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should delegate to service.login', () => {
      const credentials = { email: 'test@test.com', password: 'pass' };
      const expected = { message: 'Auth not yet implemented' };
      mockService.login.mockReturnValue(expected);
      expect(controller.login(credentials)).toEqual(expected);
      expect(mockService.login).toHaveBeenCalledWith(credentials);
    });
  });

  describe('register', () => {
    it('should delegate to service.register', () => {
      const data = { email: 'test@test.com', password: 'pass', name: 'Test' };
      const expected = { message: 'Registration not yet implemented' };
      mockService.register.mockReturnValue(expected);
      expect(controller.register(data)).toEqual(expected);
      expect(mockService.register).toHaveBeenCalledWith(data);
    });
  });
});
