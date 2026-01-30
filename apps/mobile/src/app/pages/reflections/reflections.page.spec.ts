import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReflectionsPage } from './reflections.page';

describe('ReflectionsPage', () => {
  let fixture: ComponentFixture<ReflectionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReflectionsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReflectionsPage);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have loading state initially', () => {
    expect(fixture.componentInstance.loading()).toBe(true);
  });

  it('should have empty reflections array initially', () => {
    expect(fixture.componentInstance.reflections()).toEqual([]);
  });

  it('should not show new reflection modal initially', () => {
    expect(fixture.componentInstance.showNewReflection()).toBe(false);
  });

  it('should open and close new reflection modal', () => {
    const component = fixture.componentInstance;
    component.openNewReflection();
    expect(component.showNewReflection()).toBe(true);
    component.closeNewReflection();
    expect(component.showNewReflection()).toBe(false);
  });

  it('should return correct mood emoji', () => {
    const component = fixture.componentInstance;
    expect(component.getMoodEmoji('great')).toBe('😊');
    expect(component.getMoodEmoji('good')).toBe('🙂');
    expect(component.getMoodEmoji('okay')).toBe('😐');
    expect(component.getMoodEmoji('low')).toBe('😔');
    expect(component.getMoodEmoji('difficult')).toBe('😢');
  });

  it('should add and remove gratitude items', () => {
    const component = fixture.componentInstance;
    component.gratitudeInput = 'My family';
    component.addGratitude();
    expect(component.newReflection.gratitude).toContain('My family');
    expect(component.gratitudeInput).toBe('');

    component.removeGratitude(0);
    expect(component.newReflection.gratitude.length).toBe(0);
  });
});
