import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { OsFormFieldComponent } from './os-form-field.component';
import { vi } from 'vitest';

describe('OsFormFieldComponent', () => {
  let component: OsFormFieldComponent;
  let fixture: ComponentFixture<OsFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsFormFieldComponent, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render with default values', () => {
      expect(component.label()).toBe('');
      expect(component.placeholder()).toBe('');
      expect(component.type()).toBe('text');
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('default');
      expect(component.required()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.readonly()).toBe(false);
    });

    it('should render with custom label', () => {
      fixture.componentRef.setInput('label', 'Email Address');
      fixture.detectChanges();

      expect(component.label()).toBe('Email Address');
    });

    it('should render with custom placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Enter your email');
      fixture.detectChanges();

      expect(component.placeholder()).toBe('Enter your email');
    });

    it('should render with custom type', () => {
      fixture.componentRef.setInput('type', 'email');
      fixture.detectChanges();

      expect(component.type()).toBe('email');
    });

    it('should render with custom size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      expect(component.size()).toBe('large');
    });

    it('should render with custom variant', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.detectChanges();

      expect(component.variant()).toBe('outlined');
    });
  });

  describe('size variants', () => {
    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--small')).toBe(true);
    });

    it('should apply medium size by default', () => {
      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--medium')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--large')).toBe(true);
    });
  });

  describe('variant styles', () => {
    it('should apply default variant', () => {
      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--default')).toBe(true);
    });

    it('should apply outlined variant', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--outlined')).toBe(true);
    });

    it('should apply filled variant', () => {
      fixture.componentRef.setInput('variant', 'filled');
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--filled')).toBe(true);
    });
  });

  describe('state management', () => {
    it('should apply disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--disabled')).toBe(true);
    });

    it('should apply required state', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--required')).toBe(true);
    });

    it('should apply error state', () => {
      fixture.componentRef.setInput('errorMessage', 'This field is required');
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.classList.contains('os-form-field--error')).toBe(true);
    });
  });

  describe('helper text and hints', () => {
    it('should display helper text', () => {
      fixture.componentRef.setInput('helperText', 'Enter a valid email address');
      fixture.detectChanges();

      expect(component.helperText()).toBe('Enter a valid email address');
    });

    it('should display hint text', () => {
      fixture.componentRef.setInput('hintText', 'We will never share your email');
      fixture.detectChanges();

      const hintElement = fixture.nativeElement.querySelector('.os-form-field__hint');
      expect(hintElement).toBeTruthy();
      expect(hintElement.textContent.trim()).toBe('We will never share your email');
    });

    it('should not display hint when error message is present', () => {
      fixture.componentRef.setInput('hintText', 'This is a hint');
      fixture.componentRef.setInput('errorMessage', 'This is an error');
      fixture.detectChanges();

      const hintElement = fixture.nativeElement.querySelector('os-label');
      expect(hintElement).toBeNull();
    });
  });

  describe('icons and clearable', () => {
    it('should display prefix icon', () => {
      fixture.componentRef.setInput('prefixIcon', 'search');
      fixture.detectChanges();

      expect(component.prefixIcon()).toBe('search');
    });

    it('should display suffix icon', () => {
      fixture.componentRef.setInput('suffixIcon', 'visibility');
      fixture.detectChanges();

      expect(component.suffixIcon()).toBe('visibility');
    });

    it('should enable clearable functionality', () => {
      fixture.componentRef.setInput('clearable', true);
      fixture.detectChanges();

      expect(component.clearable()).toBe(true);
    });
  });

  describe('event handling', () => {
    it('should emit value change event', () => {
      const valueChangeSpy = vi.fn();
      component.valueChange.subscribe(valueChangeSpy);

      component.onValueChange('test value');

      expect(valueChangeSpy).toHaveBeenCalledWith('test value');
    });

    it('should emit blur event', () => {
      const blurSpy = vi.fn();
      component.blurEvent.subscribe(blurSpy);

      const mockEvent = new FocusEvent('blur');
      component.onBlur(mockEvent);

      expect(blurSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should emit focus event', () => {
      const focusSpy = vi.fn();
      component.focusEvent.subscribe(focusSpy);

      const mockEvent = new FocusEvent('focus');
      component.onFocus(mockEvent);

      expect(focusSpy).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should implement writeValue', () => {
      expect(() => component.writeValue('test')).not.toThrow();
    });

    it('should implement registerOnChange', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      component.onValueChange('test');
      expect(onChangeSpy).toHaveBeenCalledWith('test');
    });

    it('should implement registerOnTouched', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      const mockEvent = new FocusEvent('blur');
      component.onBlur(mockEvent);
      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should implement setDisabledState', () => {
      expect(() => component.setDisabledState(true)).not.toThrow();
    });
  });

  describe('computed properties', () => {
    it('should compute container class correctly', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const containerClass = component.containerClass();
      expect(containerClass).toContain('os-form-field');
      expect(containerClass).toContain('os-form-field--large');
      expect(containerClass).toContain('os-form-field--outlined');
      expect(containerClass).toContain('os-form-field--disabled');
    });

    it('should compute hasError correctly', () => {
      fixture.componentRef.setInput('errorMessage', 'Error message');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Error message');
    });

    it('should compute appearance correctly', () => {
      expect(component.variant()).toBe('default');
    });

    it('should compute hint class correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const containerClass = component.containerClass();
      expect(containerClass).toContain('os-form-field');
      expect(containerClass).toContain('os-form-field--small');
      expect(containerClass).toContain('os-form-field--disabled');
    });
  });

  describe('accessibility', () => {
    it('should have unique input id', () => {
      const fieldId = component['fieldId']();
      expect(fieldId).toMatch(/^field-/);
    });

    it('should generate different ids for different instances', () => {
      const fixture2 = TestBed.createComponent(OsFormFieldComponent);
      const component2 = fixture2.componentInstance;

      expect(component['fieldId']()).not.toBe(component2['fieldId']());
    });
  });

  describe('form integration', () => {
    it('should work with reactive forms', () => {
      fixture.componentRef.setInput('value', 'test value');
      fixture.detectChanges();

      expect(component.value()).toBe('test value');
    });

    it('should handle form validation', () => {
      fixture.componentRef.setInput('required', true);
      fixture.componentRef.setInput('errorMessage', 'This field is required');
      fixture.detectChanges();

      expect(component.required()).toBe(true);
      expect(component.errorMessage()).toBe('This field is required');
    });
  });

  describe('new features', () => {
    it('should display character count when maxLength is set', () => {
      fixture.componentRef.setInput('maxLength', 100);
      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();

      expect(component.showCharacterCount()).toBe(true);
      expect(component.characterCount()).toBe(4);
    });

    it('should show validation icon when showValidationIcon is true', () => {
      fixture.componentRef.setInput('showValidationIcon', true);
      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();

      expect(component.showValidationIcon()).toBe(true);
    });

    it('should hide validation icon when showValidationIcon is false', () => {
      fixture.componentRef.setInput('showValidationIcon', false);
      fixture.detectChanges();

      expect(component.showValidationIcon()).toBe(false);
    });

    it('should display error message with icon', () => {
      fixture.componentRef.setInput('errorMessage', 'This field is required');
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.os-form-field__error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toContain('This field is required');
    });

    it('should not display hint when error message is present', () => {
      fixture.componentRef.setInput('hintText', 'This is a hint');
      fixture.componentRef.setInput('errorMessage', 'This is an error');
      fixture.detectChanges();

      const hintElement = fixture.nativeElement.querySelector('.os-form-field__hint');
      expect(hintElement).toBeNull();
    });

    it('should display hint when no error message', () => {
      fixture.componentRef.setInput('hintText', 'This is a hint');
      fixture.detectChanges();

      const hintElement = fixture.nativeElement.querySelector('.os-form-field__hint');
      expect(hintElement).toBeTruthy();
      expect(hintElement.textContent.trim()).toBe('This is a hint');
    });
  });

  describe('validation states', () => {
    it('should track touched state', () => {
      expect(component.isTouched()).toBe(false);

      component.onBlur(new FocusEvent('blur'));
      expect(component.isTouched()).toBe(true);
    });

    it('should track dirty state', () => {
      expect(component.isDirty()).toBe(false);

      component.onValueChange('test');
      expect(component.isDirty()).toBe(true);
    });

    it('should emit validation change events', () => {
      const validationChangeSpy = vi.fn();
      component.validationChange.subscribe(validationChangeSpy);

      component.onValueChange('test');
      expect(validationChangeSpy).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      expect(containerElement.getAttribute('role')).toBe('group');
      expect(containerElement.getAttribute('aria-required')).toBe('true');
    });

    it('should have proper aria-describedby when hint is present', () => {
      fixture.componentRef.setInput('hintText', 'This is a hint');
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      const describedBy = containerElement.getAttribute('aria-describedby');
      expect(describedBy).toContain('-hint');
    });

    it('should have proper aria-describedby when error is present', () => {
      fixture.componentRef.setInput('errorMessage', 'This is an error');
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      const describedBy = containerElement.getAttribute('aria-describedby');
      expect(describedBy).toContain('-error');
    });

    it('should have proper aria-describedby when character count is present', () => {
      fixture.componentRef.setInput('maxLength', 100);
      fixture.detectChanges();

      const containerElement = fixture.nativeElement.querySelector('.os-form-field');
      const describedBy = containerElement.getAttribute('aria-describedby');
      expect(describedBy).toContain('-count');
    });
  });

  describe('reactive forms integration', () => {
    it('should work with FormControl', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(component.control()).toBe(control);
    });

    it('should work with FormControl validation', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(component.control()).toBe(control);
      expect(component.hasError()).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('should compute validation icon name correctly', () => {
      expect(component.validationIconName()).toBe('');

      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();
      expect(component.validationIconName()).toBe('check_circle');

      fixture.componentRef.setInput('errorMessage', 'Error');
      fixture.detectChanges();
      expect(component.validationIconName()).toBe('error');
    });

    it('should compute validation icon size correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.validationIconSize()).toBe('xs');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.validationIconSize()).toBe('sm');
    });

    it('should compute validation icon variant correctly', () => {
      expect(component.validationIconVariant()).toBe('default');

      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();
      expect(component.validationIconVariant()).toBe('success');

      fixture.componentRef.setInput('errorMessage', 'Error');
      fixture.detectChanges();
      expect(component.validationIconVariant()).toBe('error');
    });

    it('should compute hint class correctly', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const hintClass = component.hintClass();
      expect(hintClass).toContain('os-form-field__hint');
      expect(hintClass).toContain('os-form-field__hint--large');
    });
  });
});
