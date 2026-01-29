import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GardenGuidePage } from './garden-guide.page';

describe('GardenGuidePage', () => {
  let fixture: ComponentFixture<GardenGuidePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenGuidePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenGuidePage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
