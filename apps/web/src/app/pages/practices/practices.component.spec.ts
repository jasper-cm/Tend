import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PracticesComponent } from './practices.component';

describe('PracticesComponent', () => {
  let fixture: ComponentFixture<PracticesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticesComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticesComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Practices');
  });
});
