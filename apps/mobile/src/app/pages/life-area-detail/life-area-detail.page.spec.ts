import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { LifeAreaDetailPage } from './life-area-detail.page';

describe('LifeAreaDetailPage', () => {
  let fixture: ComponentFixture<LifeAreaDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeAreaDetailPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'test-id',
              },
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LifeAreaDetailPage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have practices as default active tab', () => {
    expect(fixture.componentInstance.activeTab()).toBe('practices');
  });

  it('should be loading initially', () => {
    expect(fixture.componentInstance.loading()).toBe(true);
  });

  it('should return correct mood emoji', () => {
    const component = fixture.componentInstance;
    expect(component.getMoodEmoji('great')).toBe('😊');
    expect(component.getMoodEmoji('good')).toBe('🙂');
    expect(component.getMoodEmoji('okay')).toBe('😐');
    expect(component.getMoodEmoji('low')).toBe('😔');
    expect(component.getMoodEmoji('unknown')).toBe('😐');
  });

  it('should calculate circumference correctly', () => {
    const component = fixture.componentInstance;
    const circumference = 2 * Math.PI * 42;
    expect(component.getCircumference()).toBe(circumference);
  });

  it('should format date correctly', () => {
    const component = fixture.componentInstance;
    const formatted = component.formatDate('2025-01-15T10:00:00Z');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2025');
  });

  it('should return correct health color based on score', () => {
    const component = fixture.componentInstance;

    // Mock lifeArea with different health scores
    component.lifeArea.set({ healthScore: 80 } as any);
    expect(component.getHealthColor()).toBe('#4CAF50');

    component.lifeArea.set({ healthScore: 50 } as any);
    expect(component.getHealthColor()).toBe('#FF9800');

    component.lifeArea.set({ healthScore: 20 } as any);
    expect(component.getHealthColor()).toBe('#f44336');
  });

  it('should return correct health label', () => {
    const component = fixture.componentInstance;

    component.lifeArea.set({ healthScore: 80 } as any);
    expect(component.getHealthLabel()).toBe('Thriving');

    component.lifeArea.set({ healthScore: 50 } as any);
    expect(component.getHealthLabel()).toBe('Growing');

    component.lifeArea.set({ healthScore: 20 } as any);
    expect(component.getHealthLabel()).toBe('Needs Care');
  });

  it('should return correct practice gradient', () => {
    const component = fixture.componentInstance;

    // Inactive
    expect(component.getPracticeGradient({ isActive: false, currentStreak: 0 } as any)).toContain('9E9E9E');

    // Hot streak (7+ days)
    expect(component.getPracticeGradient({ isActive: true, currentStreak: 10 } as any)).toContain('FF9800');

    // Active streak
    expect(component.getPracticeGradient({ isActive: true, currentStreak: 3 } as any)).toContain('4CAF50');

    // No streak
    expect(component.getPracticeGradient({ isActive: true, currentStreak: 0 } as any)).toContain('2196F3');
  });

  it('should return correct mood gradient', () => {
    const component = fixture.componentInstance;
    expect(component.getMoodGradient('great')).toContain('E8F5E9');
    expect(component.getMoodGradient('low')).toContain('FFF3E0');
    expect(component.getMoodGradient('difficult')).toContain('FFEBEE');
  });
});
