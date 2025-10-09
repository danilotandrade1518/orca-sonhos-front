import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsFormGroupComponent } from './os-form-group.component';

describe('OsFormGroupComponent', () => {
  let component: OsFormGroupComponent;
  let fixture: ComponentFixture<OsFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsFormGroupComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsFormGroupComponent);
    fixture.componentRef.setInput('title', 'Test Group');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.os-form-group__title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toBe('Test Title');
  });

  it('should render description when provided', () => {
    fixture.componentRef.setInput('description', 'Test Description');
    fixture.detectChanges();

    const descriptionElement = fixture.nativeElement.querySelector('.os-form-group__description');
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.textContent).toBe('Test Description');
  });

  it('should render helper text when provided', () => {
    fixture.componentRef.setInput('helperText', 'Test Helper');
    fixture.detectChanges();

    const helperElement = fixture.nativeElement.querySelector('.os-form-group__helper');
    expect(helperElement).toBeTruthy();
    expect(helperElement.textContent).toBe('Test Helper');
  });

  it('should apply variant classes', () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('fieldset');
    expect(fieldset.classList.contains('os-form-group--compact')).toBe(true);
  });

  it('should apply size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('fieldset');
    expect(fieldset.classList.contains('os-form-group--large')).toBe(true);
  });

  it('should apply required class when required is true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('fieldset');
    expect(fieldset.classList.contains('os-form-group--required')).toBe(true);
  });

  it('should not show title when not provided', () => {
    fixture.componentRef.setInput('title', '');
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.os-form-group__title');
    expect(titleElement).toBeFalsy();
  });

  it('should not show description when not provided', () => {
    fixture.componentRef.setInput('description', '');
    fixture.detectChanges();

    const descriptionElement = fixture.nativeElement.querySelector('.os-form-group__description');
    expect(descriptionElement).toBeFalsy();
  });

  it('should not show helper text when not provided', () => {
    fixture.componentRef.setInput('helperText', '');
    fixture.detectChanges();

    const helperElement = fixture.nativeElement.querySelector('.os-form-group__helper');
    expect(helperElement).toBeFalsy();
  });

  it('should have correct default values', () => {
    expect(component.variant()).toBe('default');
    expect(component.size()).toBe('medium');
    expect(component.required()).toBe(false);
  });

  it('should render content projection', () => {
    fixture.nativeElement.innerHTML = `
      <os-form-group>
        <div class="test-content">Test Content</div>
      </os-form-group>
    `;
    fixture.detectChanges();

    const contentElement = fixture.nativeElement.querySelector('.test-content');
    expect(contentElement).toBeTruthy();
    expect(contentElement.textContent).toBe('Test Content');
  });
});
