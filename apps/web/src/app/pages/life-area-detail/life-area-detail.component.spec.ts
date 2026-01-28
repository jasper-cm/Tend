import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LifeAreaDetailComponent } from './life-area-detail.component';

describe('LifeAreaDetailComponent', () => {
  let fixture: ComponentFixture<LifeAreaDetailComponent>;
  let component: LifeAreaDetailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeAreaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'test-life-area-id' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LifeAreaDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read lifeAreaId from route params on init', () => {
    fixture.detectChanges();
    expect(component.lifeAreaId).toBe('test-life-area-id');
  });

  it('should display the life area id', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('test-life-area-id');
  });
});
