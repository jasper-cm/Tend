import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PracticesPage } from './practices.page';

describe('PracticesPage', () => {
  let fixture: ComponentFixture<PracticesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticesPage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
