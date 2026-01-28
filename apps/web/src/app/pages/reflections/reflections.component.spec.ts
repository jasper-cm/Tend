import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReflectionsComponent } from './reflections.component';

describe('ReflectionsComponent', () => {
  let fixture: ComponentFixture<ReflectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReflectionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReflectionsComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Reflections');
  });
});
