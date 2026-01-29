import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthBadgeComponent } from './health-badge.component';

describe('HealthBadgeComponent', () => {
  let fixture: ComponentFixture<HealthBadgeComponent>;
  let component: HealthBadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default score to 0', () => {
    expect(component.score).toBe(0);
  });

  it('should display the score as a percentage', () => {
    component.score = 85;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('85%');
  });

  describe('badgeClass', () => {
    it('should return spirit class for score >= 75', () => {
      component.score = 75;
      expect(component.badgeClass).toContain('spirit');
    });

    it('should return golden class for score >= 50', () => {
      component.score = 60;
      expect(component.badgeClass).toContain('golden');
    });

    it('should return bloom class for score >= 25', () => {
      component.score = 30;
      expect(component.badgeClass).toContain('bloom');
    });

    it('should return earth class for score < 25', () => {
      component.score = 10;
      expect(component.badgeClass).toContain('earth');
    });
  });
});
