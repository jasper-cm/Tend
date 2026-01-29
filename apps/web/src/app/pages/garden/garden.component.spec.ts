import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GardenComponent } from './garden.component';

describe('GardenComponent', () => {
  let fixture: ComponentFixture<GardenComponent>;
  let component: GardenComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Your Life Garden');
  });
});
