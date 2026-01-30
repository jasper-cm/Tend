import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReflectionsComponent } from './reflections.component';

describe('ReflectionsComponent', () => {
  let fixture: ComponentFixture<ReflectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReflectionsComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ReflectionsComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Reflections');
  });
});
