import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GardenGuidePage } from './garden-guide.page';

describe('GardenGuidePage', () => {
  let fixture: ComponentFixture<GardenGuidePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenGuidePage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenGuidePage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have empty messages array initially', () => {
    expect(fixture.componentInstance.messages()).toEqual([]);
  });

  it('should have chat as default view mode', () => {
    expect(fixture.componentInstance.viewMode()).toBe('chat');
  });

  it('should not be typing initially', () => {
    expect(fixture.componentInstance.isTyping()).toBe(false);
  });

  it('should return correct insight icons', () => {
    const component = fixture.componentInstance;
    expect(component.getInsightIcon('celebration')).toBe('🎉');
    expect(component.getInsightIcon('encouragement')).toBe('💪');
    expect(component.getInsightIcon('suggestion')).toBe('💡');
    expect(component.getInsightIcon('observation')).toBe('👀');
    expect(component.getInsightIcon('unknown')).toBe('🌱');
  });

  it('should have quick prompts defined', () => {
    const component = fixture.componentInstance;
    expect(component.quickPrompts.length).toBeGreaterThan(0);
    expect(component.quickPrompts[0].text).toBe('How is my garden doing?');
    expect(component.quickPrompts[0].icon).toBeTruthy();
  });

  it('should return correct insight color', () => {
    const component = fixture.componentInstance;
    expect(component.getInsightColor('celebration')).toBe('#22c55e');
    expect(component.getInsightColor('encouragement')).toBe('#f59e0b');
    expect(component.getInsightColor('suggestion')).toBe('#3b82f6');
    expect(component.getInsightColor('observation')).toBe('#8b5cf6');
    expect(component.getInsightColor('unknown')).toBe('#22c55e');
  });

  it('should return correct insight background', () => {
    const component = fixture.componentInstance;
    expect(component.getInsightBackground('celebration')).toContain('f0fdf4');
    expect(component.getInsightBackground('encouragement')).toContain('fefce8');
    expect(component.getInsightBackground('suggestion')).toContain('eff6ff');
  });

  it('should return correct insight gradient', () => {
    const component = fixture.componentInstance;
    expect(component.getInsightGradient('celebration')).toContain('bbf7d0');
    expect(component.getInsightGradient('encouragement')).toContain('fde68a');
  });

  it('should format time correctly', () => {
    const component = fixture.componentInstance;
    const testDate = new Date('2025-01-15T10:30:00');
    const formatted = component.formatTime(testDate);
    expect(formatted).toContain('10');
    expect(formatted).toContain('30');
  });
});
