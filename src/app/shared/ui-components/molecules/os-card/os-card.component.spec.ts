import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsCardComponent } from './os-card.component';

describe('OsCardComponent', () => {
  let component: OsCardComponent;
  let fixture: ComponentFixture<OsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default variant by default', () => {
    expect(component.variant()).toBe('default');
  });

  it('should apply correct classes', () => {
    const classes = component.cardClasses();
    expect(classes).toContain('os-card');
    expect(classes).toContain('os-card--default');
  });

  it('should apply correct classes for outlined variant', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();

    const classes = component.cardClasses();
    expect(classes).toContain('os-card--outlined');
  });

  it('should apply correct classes for elevated variant', () => {
    fixture.componentRef.setInput('variant', 'elevated');
    fixture.detectChanges();

    const classes = component.cardClasses();
    expect(classes).toContain('os-card--elevated');
  });
});
