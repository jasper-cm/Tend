---
layout: default
title: Testing
nav_order: 10
---

# Testing Guide

Tend uses a comprehensive testing strategy with Jest for unit tests and Playwright for end-to-end tests.

---

## Testing Stack

| Tool | Purpose | Projects |
|------|---------|----------|
| **Jest** | Unit and integration tests | All apps and libs |
| **jest-preset-angular** | Angular component testing | web, mobile, ui |
| **Playwright** | End-to-end testing | e2e/web, e2e/api |
| **ts-jest** | TypeScript support | All projects |

---

## Running Tests

### All Unit Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npx nx run-many -t test --coverage
```

### Specific Project Tests

```bash
# Test API
npx nx run api:test

# Test web app
npx nx run web:test

# Test mobile app
npx nx run mobile:test

# Test shared utilities
npx nx run shared-utils:test

# Test UI components
npx nx run ui:test
```

### Watch Mode

```bash
# Watch mode for active development
npx nx run api:test --watch
```

### Coverage Report

```bash
# Generate coverage report
npx nx run api:test --coverage

# View coverage in browser
open coverage/apps/api/lcov-report/index.html
```

---

## Unit Testing

### API Services

Test services by mocking the Prisma client:

```typescript
// life-areas.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LifeAreasService } from './life-areas.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('LifeAreasService', () => {
  let service: LifeAreasService;

  const mockPrisma = {
    lifeArea: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LifeAreasService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LifeAreasService>(LifeAreasService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return life areas ordered by name', async () => {
      const expected = [{ id: '1', name: 'Health', healthScore: 75 }];
      mockPrisma.lifeArea.findMany.mockResolvedValue(expected);

      const result = await service.findAll();

      expect(result).toEqual(expected);
      expect(mockPrisma.lifeArea.findMany).toHaveBeenCalledWith({
        include: { practices: true },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      mockPrisma.lifeArea.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
```

### API Controllers

Test controllers by mocking the service:

```typescript
// life-areas.controller.spec.ts
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

  describe('findAll', () => {
    it('should delegate to service', async () => {
      const expected = [{ id: '1', name: 'Health' }];
      mockService.findAll.mockResolvedValue(expected);

      await expect(controller.findAll()).resolves.toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });
});
```

### Angular Components

Test standalone components using Angular's TestBed:

```typescript
// garden.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GardenComponent } from './garden.component';
import { LifeAreaCardComponent } from '@tend/ui';

describe('GardenComponent', () => {
  let fixture: ComponentFixture<GardenComponent>;
  let component: GardenComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display life areas', () => {
    component.lifeAreas = [
      { id: '1', name: 'Health', healthScore: 75, ... }
    ];
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('tend-life-area-card');
    expect(cards.length).toBe(1);
  });
});
```

### Shared Utilities

Test utility functions with edge cases:

```typescript
// streak-calculator.spec.ts
import { calculateStreak, calculateLongestStreak } from './streak-calculator';
import { daysAgo } from './date-utils';

describe('calculateStreak', () => {
  it('should return 0 for empty array', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('should return 1 for completion today only', () => {
    expect(calculateStreak([new Date()])).toBe(1);
  });

  it('should count consecutive days', () => {
    const dates = [new Date(), daysAgo(1), daysAgo(2)];
    expect(calculateStreak(dates)).toBe(3);
  });

  it('should return 0 if streak is broken', () => {
    const dates = [daysAgo(3)]; // Too old
    expect(calculateStreak(dates)).toBe(0);
  });

  it('should handle multiple completions on same day', () => {
    const today = new Date();
    const dates = [today, today, daysAgo(1)];
    expect(calculateStreak(dates)).toBe(2);
  });
});
```

---

## End-to-End Testing

### Web Application E2E

Tests run against the built web application:

```typescript
// e2e/web/src/garden.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Garden Overview', () => {
  test('should display the garden page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Tend/);
  });

  test('should navigate to life areas', async ({ page }) => {
    await page.goto('/life-areas');
    await expect(page.locator('h1')).toContainText('Life Areas');
  });
});
```

### API E2E

Tests verify API endpoints are working:

```typescript
// e2e/api/src/health.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Health', () => {
  test('should return health status', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('tend-api');
  });
});
```

### Running E2E Tests

```bash
# Install Playwright browsers
npx playwright install

# Run all e2e tests
npm run e2e

# Run web e2e only
npx nx run web-e2e:e2e

# Run API e2e only
npx nx run api-e2e:e2e

# Run with UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test garden.spec.ts

# Generate test report
npx playwright show-report
```

### Playwright Configuration

```typescript
// e2e/web/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx nx run web:serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Test Organization

### File Naming

| Type | Pattern | Location |
|------|---------|----------|
| Unit test | `*.spec.ts` | Same directory as source |
| E2E test | `*.spec.ts` | `e2e/*/src/` |

### Test Structure

```
apps/api/
├── src/
│   └── modules/
│       └── life-areas/
│           ├── life-areas.controller.ts
│           ├── life-areas.controller.spec.ts  # Controller tests
│           ├── life-areas.service.ts
│           └── life-areas.service.spec.ts     # Service tests

libs/shared/utils/
└── src/
    └── lib/
        ├── streak-calculator.ts
        └── streak-calculator.spec.ts          # Utility tests

e2e/
├── web/
│   └── src/
│       └── garden.spec.ts                     # Web e2e tests
└── api/
    └── src/
        └── health.spec.ts                     # API e2e tests
```

---

## Continuous Integration

Tests run automatically on every pull request:

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - uses: nrwl/nx-set-shas@v4
      - run: npx nx affected --target=test --coverage

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx nx affected --target=e2e
```

### Affected Tests

Nx only runs tests for affected projects:

```bash
# Only run tests affected by your changes
npx nx affected --target=test

# See what would be tested
npx nx affected --target=test --dry-run
```

---

## Best Practices

### Testing Guidelines

1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **Use descriptive test names** - Tests serve as documentation
3. **One assertion per test when possible** - Makes failures clear
4. **Mock external dependencies** - Database, HTTP, file system
5. **Test edge cases** - Empty arrays, null values, boundaries

### Mocking Patterns

```typescript
// Mock Prisma operations
const mockPrisma = {
  lifeArea: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(data => ({ id: 'new-id', ...data })),
  },
};

// Mock HTTP client
const mockHttp = {
  get: jest.fn().mockReturnValue(of({ data: [] })),
  post: jest.fn().mockReturnValue(of({ id: '1' })),
};

// Reset mocks between tests
afterEach(() => jest.clearAllMocks());
```

### Coverage Targets

| Project | Target | Current |
|---------|--------|---------|
| API | 80% | ~75% |
| Web | 70% | ~65% |
| UI | 90% | ~85% |
| Utils | 95% | ~90% |

---

## Debugging Tests

### Jest

```bash
# Run specific test file
npx jest path/to/test.spec.ts

# Run tests matching pattern
npx jest --testNamePattern="should return"

# Debug with node inspector
node --inspect-brk node_modules/.bin/jest --runInBand path/to/test.spec.ts
```

### Playwright

```bash
# Debug mode with browser
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Generate tests interactively
npx playwright codegen localhost:4200
```
