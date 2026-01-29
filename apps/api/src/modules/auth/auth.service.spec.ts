import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a not-yet-implemented message', async () => {
      const result = await service.login({ email: 'test@test.com', password: 'pass' });
      expect(result).toEqual({ message: 'Auth not yet implemented' });
    });
  });

  describe('register', () => {
    it('should return a not-yet-implemented message', async () => {
      const result = await service.register({ email: 'test@test.com', password: 'pass' });
      expect(result).toEqual({ message: 'Registration not yet implemented' });
    });
  });
});
