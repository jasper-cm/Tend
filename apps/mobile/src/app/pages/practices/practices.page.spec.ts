import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PracticesPage } from './practices.page';

describe('PracticesPage', () => {
  let fixture: ComponentFixture<PracticesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticesPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticesPage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have loading state initially', () => {
    expect(fixture.componentInstance.loading()).toBe(true);
  });

  it('should have empty practices array initially', () => {
    expect(fixture.componentInstance.practices()).toEqual([]);
  });

  it('should have default filter set to all', () => {
    expect(fixture.componentInstance.filter()).toBe('all');
  });

  it('should filter practices correctly', () => {
    const component = fixture.componentInstance;
    component.practices.set([
      { id: '1', name: 'Test 1', isActive: true, currentStreak: 5 } as any,
      { id: '2', name: 'Test 2', isActive: false, currentStreak: 0 } as any,
      { id: '3', name: 'Test 3', isActive: true, currentStreak: 0 } as any,
    ]);

    component.filter.set('all');
    expect(component.filteredPractices().length).toBe(3);

    component.filter.set('active');
    expect(component.filteredPractices().length).toBe(2);

    component.filter.set('streaks');
    expect(component.filteredPractices().length).toBe(1);
  });

  it('should return correct filter title', () => {
    const component = fixture.componentInstance;

    component.filter.set('all');
    expect(component.getFilterTitle()).toBe('All Practices');

    component.filter.set('active');
    expect(component.getFilterTitle()).toBe('Active Practices');

    component.filter.set('streaks');
    expect(component.getFilterTitle()).toBe('Practices on Streak');
  });

  it('should return correct practice gradient', () => {
    const component = fixture.componentInstance;

    // Inactive practice - grey
    expect(component.getPracticeGradient({ isActive: false, currentStreak: 0 } as any)).toContain('9E9E9E');

    // Active with 7+ streak - orange/fire
    expect(component.getPracticeGradient({ isActive: true, currentStreak: 10 } as any)).toContain('FF9800');

    // Active with some streak - green
    expect(component.getPracticeGradient({ isActive: true, currentStreak: 3 } as any)).toContain('4CAF50');

    // Active with no streak - blue
    expect(component.getPracticeGradient({ isActive: true, currentStreak: 0 } as any)).toContain('2196F3');
  });

  it('should return correct category emoji', () => {
    const component = fixture.componentInstance;
    expect(component.getCategoryEmoji('habit')).toBe('🔄');
    expect(component.getCategoryEmoji('mindfulness')).toBe('🧘');
    expect(component.getCategoryEmoji('unknown')).toBe('🌿');
  });

  it('should have suggested practices for empty state', () => {
    const component = fixture.componentInstance;
    expect(component.suggestedPractices.length).toBeGreaterThan(0);
    expect(component.suggestedPractices[0].name).toBeTruthy();
    expect(component.suggestedPractices[0].emoji).toBeTruthy();
  });
});
