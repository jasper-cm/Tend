import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshTokens: jest.fn(),
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
    it('should delegate to service.login', async () => {
      const mockUser = { id: '1', email: 'test@test.com', displayName: 'Test' };
      const mockRequest = { user: mockUser };
      const expected = {
        accessToken: 'token',
        refreshToken: 'refresh',
        user: mockUser,
      };
      mockService.login.mockResolvedValue(expected);

      const result = await controller.login(mockRequest);

      expect(result).toEqual(expected);
      expect(mockService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('register', () => {
    it('should delegate to service.register', async () => {
      const data = {
        email: 'test@test.com',
        password: 'password123',
        displayName: 'Test User',
      };
      const expected = {
        accessToken: 'token',
        refreshToken: 'refresh',
        user: { id: '1', email: 'test@test.com', displayName: 'Test User', avatarUrl: null },
      };
      mockService.register.mockResolvedValue(expected);

      const result = await controller.register(data);

      expect(result).toEqual(expected);
      expect(mockService.register).toHaveBeenCalledWith(data);
    });
  });
});
