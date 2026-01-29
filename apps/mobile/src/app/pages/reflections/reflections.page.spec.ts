import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReflectionsPage } from './reflections.page';

describe('ReflectionsPage', () => {
  let fixture: ComponentFixture<ReflectionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReflectionsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReflectionsPage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
