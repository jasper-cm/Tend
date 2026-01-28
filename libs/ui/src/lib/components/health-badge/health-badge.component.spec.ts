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
    it('should return green class for score >= 75', () => {
      component.score = 75;
      expect(component.badgeClass).toContain('green');
    });

    it('should return yellow class for score >= 50', () => {
      component.score = 60;
      expect(component.badgeClass).toContain('yellow');
    });

    it('should return orange class for score >= 25', () => {
      component.score = 30;
      expect(component.badgeClass).toContain('orange');
    });

    it('should return red class for score < 25', () => {
      component.score = 10;
      expect(component.badgeClass).toContain('red');
    });
  });
});
