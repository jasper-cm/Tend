import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GardenPage } from './garden.page';

describe('GardenPage', () => {
  let fixture: ComponentFixture<GardenPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenPage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have loading state initially', () => {
    expect(fixture.componentInstance.loading()).toBe(true);
  });

  it('should have empty lifeAreas array initially', () => {
    expect(fixture.componentInstance.lifeAreas()).toEqual([]);
  });

  it('should return correct health color for different scores', () => {
    const component = fixture.componentInstance;
    expect(component.getHealthColor(80)).toBe('success');
    expect(component.getHealthColor(60)).toBe('warning');
    expect(component.getHealthColor(30)).toBe('danger');
  });

  it('should return correct greeting based on time of day', () => {
    const component = fixture.componentInstance;
    const greeting = component.getGreeting();
    expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(greeting);
  });

  it('should return correct emoji for icons', () => {
    const component = fixture.componentInstance;
    expect(component.getEmoji('heart')).toBe('❤️');
    expect(component.getEmoji('brain')).toBe('🧠');
    expect(component.getEmoji('unknown')).toBe('🌿');
  });

  it('should have suggested areas for empty state', () => {
    const component = fixture.componentInstance;
    expect(component.suggestedAreas.length).toBeGreaterThan(0);
    expect(component.suggestedAreas[0].name).toBeTruthy();
    expect(component.suggestedAreas[0].emoji).toBeTruthy();
  });

  it('should return correct health gradient', () => {
    const component = fixture.componentInstance;
    expect(component.getHealthGradient(80)).toContain('bbf7d0');
    expect(component.getHealthGradient(60)).toContain('fde68a');
    expect(component.getHealthGradient(30)).toContain('fecdd3');
  });
});
