import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { OsFormGroupComponent } from './os-form-group.component';

describe('OsFormGroupComponent', () => {
  let component: OsFormGroupComponent;
  let fixture: ComponentFixture<OsFormGroupComponent>;
  let mockBreakpointObserver: {
    observe: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockBreakpointObserver = {
      observe: vi.fn().mockReturnValue(of({ matches: false, breakpoints: {} })),
    };

    await TestBed.configureTestingModule({
      imports: [OsFormGroupComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OsFormGroupComponent);
    fixture.componentRef.setInput('title', 'Test Group');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct default values', () => {
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('medium');
      expect(component.columns()).toBe(1);
      expect(component.required()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.invalid()).toBe(false);
    });
  });

  describe('Content Rendering', () => {
    it('should render title when provided', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.os-form-group__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent.trim()).toBe('Test Title');
    });

    it('should render description when provided', () => {
      fixture.componentRef.setInput('description', 'Test Description');
      fixture.detectChanges();

      const descriptionElement = fixture.nativeElement.querySelector('.os-form-group__description');
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement.textContent.trim()).toBe('Test Description');
    });

    it('should render helper text when provided and not invalid', () => {
      fixture.componentRef.setInput('helperText', 'Test Helper');
      fixture.componentRef.setInput('invalid', false);
      fixture.detectChanges();

      const helperElement = fixture.nativeElement.querySelector('.os-form-group__helper');
      expect(helperElement).toBeTruthy();
      expect(helperElement.textContent.trim()).toBe('Test Helper');
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

  describe('Variants', () => {
    it('should apply compact variant class', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--compact')).toBe(true);
    });

    it('should apply spaced variant class', () => {
      fixture.componentRef.setInput('variant', 'spaced');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--spaced')).toBe(true);
    });

    it('should not apply variant class for default', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--default')).toBe(false);
    });
  });

  describe('Sizes', () => {
    it('should apply small size class', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--small')).toBe(true);
    });

    it('should apply large size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--large')).toBe(true);
    });

    it('should not apply size class for medium', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--medium')).toBe(false);
    });
  });

  describe('Column Layouts', () => {
    it('should apply columns-2 class when columns is 2', () => {
      fixture.componentRef.setInput('columns', 2);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--columns-2')).toBe(true);
    });

    it('should apply columns-3 class when columns is 3', () => {
      fixture.componentRef.setInput('columns', 3);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--columns-3')).toBe(true);
    });

    it('should not apply column class when columns is 1', () => {
      fixture.componentRef.setInput('columns', 1);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--columns-1')).toBe(false);
    });

    it('should force 1 column on mobile regardless of columns input', () => {
      fixture.componentRef.setInput('columns', 3);
      component.isMobile.set(true);
      fixture.detectChanges();

      expect(component.effectiveColumns()).toBe(1);
    });

    it('should respect columns input on desktop', () => {
      fixture.componentRef.setInput('columns', 3);
      component.isMobile.set(false);
      fixture.detectChanges();

      expect(component.effectiveColumns()).toBe(3);
    });
  });

  describe('States', () => {
    it('should apply required class when required is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--required')).toBe(true);
    });

    it('should apply disabled class when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--disabled')).toBe(true);
    });

    it('should apply invalid class when invalid is true', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.classList.contains('os-form-group--invalid')).toBe(true);
    });

    it('should show error message when invalid and errorMessage provided', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('errorMessage', 'Test Error');
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.os-form-group__error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Test Error');
    });

    it('should not show error message when not invalid', () => {
      fixture.componentRef.setInput('invalid', false);
      fixture.componentRef.setInput('errorMessage', 'Test Error');
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.os-form-group__error');
      expect(errorElement).toBeFalsy();
    });

    it('should hide helper text when invalid', () => {
      fixture.componentRef.setInput('helperText', 'Test Helper');
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      const helperElement = fixture.nativeElement.querySelector('.os-form-group__helper');
      expect(helperElement).toBeFalsy();
    });
  });

  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('should have unique legend id', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const legend = fixture.nativeElement.querySelector('legend');
      expect(legend.id).toBeTruthy();
      expect(legend.id).toMatch(/^os-form-group-legend-/);
    });

    it('should have unique description id', () => {
      fixture.componentRef.setInput('description', 'Test Description');
      fixture.detectChanges();

      const description = fixture.nativeElement.querySelector('.os-form-group__description');
      expect(description.id).toBeTruthy();
      expect(description.id).toMatch(/^os-form-group-desc-/);
    });

    it('should have unique helper id', () => {
      fixture.componentRef.setInput('helperText', 'Test Helper');
      fixture.detectChanges();

      const helper = fixture.nativeElement.querySelector('.os-form-group__helper');
      expect(helper.id).toBeTruthy();
      expect(helper.id).toMatch(/^os-form-group-helper-/);
    });

    it('should have unique error id', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('errorMessage', 'Test Error');
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.os-form-group__error');
      expect(error.id).toBeTruthy();
      expect(error.id).toMatch(/^os-form-group-error-/);
    });

    it('should set aria-invalid attribute when invalid', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-required attribute when required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.getAttribute('aria-required')).toBe('true');
    });

    it('should set disabled attribute when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.hasAttribute('disabled')).toBe(true);
    });

    it('should set aria-describedby with description id', () => {
      fixture.componentRef.setInput('description', 'Test Description');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      const descriptionId = component.descriptionId();
      expect(fieldset.getAttribute('aria-describedby')).toContain(descriptionId);
    });

    it('should set aria-describedby with error id when invalid', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('errorMessage', 'Test Error');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      const errorId = component.errorId();
      expect(fieldset.getAttribute('aria-describedby')).toContain(errorId);
    });

    it('should set aria-describedby with helper id when not invalid', () => {
      fixture.componentRef.setInput('helperText', 'Test Helper');
      fixture.componentRef.setInput('invalid', false);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      const helperId = component.helperId();
      expect(fieldset.getAttribute('aria-describedby')).toContain(helperId);
    });

    it('should have role="alert" on error message', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('errorMessage', 'Test Error');
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.os-form-group__error');
      expect(error.getAttribute('role')).toBe('alert');
    });

    it('should have aria-live="polite" on error message', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('errorMessage', 'Test Error');
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.os-form-group__error');
      expect(error.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('Responsiveness', () => {
    it('should observe breakpoints on init', () => {
      expect(mockBreakpointObserver.observe).toHaveBeenCalled();
    });

    it('should set isMobile to true when matches mobile breakpoint', async () => {
      const mobileMockObserver = {
        observe: vi.fn().mockReturnValue(of({ matches: true, breakpoints: {} })),
      };

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [OsFormGroupComponent],
        providers: [
          provideZonelessChangeDetection(),
          { provide: BreakpointObserver, useValue: mobileMockObserver },
        ],
      }).compileComponents();

      const newFixture = TestBed.createComponent(OsFormGroupComponent);
      newFixture.detectChanges();

      expect(newFixture.componentInstance.isMobile()).toBe(true);
    });

    it('should set isMobile to false when does not match mobile breakpoint', async () => {
      const desktopMockObserver = {
        observe: vi.fn().mockReturnValue(of({ matches: false, breakpoints: {} })),
      };

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [OsFormGroupComponent],
        providers: [
          provideZonelessChangeDetection(),
          { provide: BreakpointObserver, useValue: desktopMockObserver },
        ],
      }).compileComponents();

      const newFixture = TestBed.createComponent(OsFormGroupComponent);
      newFixture.detectChanges();

      expect(newFixture.componentInstance.isMobile()).toBe(false);
    });
  });

  describe('Data Attributes', () => {
    it('should set data-variant attribute', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.getAttribute('data-variant')).toBe('compact');
    });

    it('should set data-size attribute', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.getAttribute('data-size')).toBe('large');
    });

    it('should set data-columns attribute', () => {
      fixture.componentRef.setInput('columns', 2);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.getAttribute('data-columns')).toBe('2');
    });

    it('should set data-columns to 1 on mobile even with columns=3', () => {
      fixture.componentRef.setInput('columns', 3);
      component.isMobile.set(true);
      fixture.detectChanges();

      const fieldset = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.getAttribute('data-columns')).toBe('1');
    });
  });
});
