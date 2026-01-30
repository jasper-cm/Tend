import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent (mobile)', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-app', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-app')).toBeTruthy();
  });

  it('should have main menu items defined', () => {
    expect(fixture.componentInstance.mainMenuItems.length).toBe(4);
    expect(fixture.componentInstance.mainMenuItems[0].title).toBe('My Garden');
  });

  it('should have settings menu items defined', () => {
    expect(fixture.componentInstance.settingsMenuItems.length).toBeGreaterThan(0);
    expect(fixture.componentInstance.settingsMenuItems[0].title).toBe('Profile');
  });

  it('should render ion-menu', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-menu')).toBeTruthy();
  });
});
