import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GardenPage } from './garden.page';

describe('GardenPage', () => {
  let fixture: ComponentFixture<GardenPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GardenPage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
