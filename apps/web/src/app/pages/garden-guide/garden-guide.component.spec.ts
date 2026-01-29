import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GardenGuideComponent } from './garden-guide.component';

describe('GardenGuideComponent', () => {
  let fixture: ComponentFixture<GardenGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenGuideComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenGuideComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Garden Guide');
  });
});
