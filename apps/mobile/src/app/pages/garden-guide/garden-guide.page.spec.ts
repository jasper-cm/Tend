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
    expect(component.quickPrompts).toContain('How is my garden doing?');
  });
});
