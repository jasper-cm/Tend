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

  it('should calculate stroke dasharray correctly', () => {
    const component = fixture.componentInstance;
    const circumference = 2 * Math.PI * 52;
    expect(component.getStrokeDasharray()).toBe(`${circumference}`);
  });

  it('should format date correctly', () => {
    const component = fixture.componentInstance;
    const formatted = component.formatDate('2025-01-15T10:00:00Z');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2025');
  });
});
