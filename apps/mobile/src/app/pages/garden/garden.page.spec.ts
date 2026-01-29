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

  it('should have empty plants array initially', () => {
    expect(fixture.componentInstance.plants()).toEqual([]);
  });

  it('should return correct health color for different scores', () => {
    const component = fixture.componentInstance;
    expect(component.getHealthColor(80)).toBe('#3d9a50');
    expect(component.getHealthColor(60)).toBe('#f2b82b');
    expect(component.getHealthColor(30)).toBe('#e15f87');
  });

  it('should return correct health label for different scores', () => {
    const component = fixture.componentInstance;
    expect(component.getHealthLabel(80)).toBe('Thriving');
    expect(component.getHealthLabel(60)).toBe('Growing');
    expect(component.getHealthLabel(30)).toBe('Needs care');
  });
});
