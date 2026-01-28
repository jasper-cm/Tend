import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticesComponent } from './practices.component';

describe('PracticesComponent', () => {
  let fixture: ComponentFixture<PracticesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticesComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Practices');
  });
});
