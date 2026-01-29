import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LifeAreaDetailComponent } from './life-area-detail.component';

describe('LifeAreaDetailComponent', () => {
  let fixture: ComponentFixture<LifeAreaDetailComponent>;
  let component: LifeAreaDetailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeAreaDetailComponent, HttpClientTestingModule],
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

  it('should have lifeArea signal initialized as null', () => {
    expect(component.lifeArea()).toBeNull();
  });
});
