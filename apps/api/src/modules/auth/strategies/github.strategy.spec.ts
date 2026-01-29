import { Test, TestingModule } from '@nestjs/testing';
import { GitHubStrategy } from './github.strategy';
import { AuthService } from '../auth.service';

describe('GitHubStrategy', () => {
  let strategy: GitHubStrategy;
  const mockAuthService = {};

  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    delete process.env.GITHUB_CLIENT_ID;
    delete process.env.GITHUB_CLIENT_SECRET;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitHubStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<GitHubStrategy>(GitHubStrategy);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
});
