import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LifeAreaCardComponent } from './life-area-card.component';

describe('LifeAreaCardComponent', () => {
  let fixture: ComponentFixture<LifeAreaCardComponent>;
  let component: LifeAreaCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeAreaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LifeAreaCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the life area name', () => {
    component.name = 'Health';
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.textContent).toContain('Health');
  });

  it('should display the description', () => {
    component.description = 'Physical and mental wellbeing';
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Physical and mental wellbeing');
  });

  it('should display active practices count', () => {
    component.activePractices = 3;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('3 active practices');
  });

  it('should emit selected event on click', () => {
    const spy = jest.spyOn(component.selected, 'emit');
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('div');
    card?.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should default color to leaf green', () => {
    expect(component.color).toBe('#65a30d');
  });

  it('should default healthScore to 50', () => {
    expect(component.healthScore).toBe(50);
  });
});
