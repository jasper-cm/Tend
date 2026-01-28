import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LifeAreasComponent } from './life-areas.component';

describe('LifeAreasComponent', () => {
  let fixture: ComponentFixture<LifeAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeAreasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LifeAreasComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Life Areas');
  });
});
