import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreakIndicatorComponent } from './streak-indicator.component';

describe('StreakIndicatorComponent', () => {
  let fixture: ComponentFixture<StreakIndicatorComponent>;
  let component: StreakIndicatorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreakIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StreakIndicatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default currentStreak to 0', () => {
    expect(component.currentStreak).toBe(0);
  });

  it('should default longestStreak to 0', () => {
    expect(component.longestStreak).toBe(0);
  });

  it('should display the current streak', () => {
    component.currentStreak = 7;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('7');
  });

  it('should display longest streak when > 0', () => {
    component.currentStreak = 5;
    component.longestStreak = 12;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('12');
  });
});
