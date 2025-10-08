import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
      expect(hintElement.textContent.trim()).toBe('We will never share your email');
    });

    it('should not display hint when error message is present', () => {
      fixture.componentRef.setInput('hintText', 'This is a hint');
      fixture.componentRef.setInput('errorMessage', 'This is an error');
      fixture.detectChanges();

      const hintElement = fixture.nativeElement.querySelector('.os-form-field__hint');
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

      const mockEvent = {
        target: { value: 'test value' },
      } as any;
      component.handleInput(mockEvent);

      expect(valueChangeSpy).toHaveBeenCalledWith('test value');
    });

    it('should emit blur event', () => {
      const blurSpy = vi.fn();
      component.blurEvent.subscribe(blurSpy);

      const mockEvent = new FocusEvent('blur');
      component.handleBlur(mockEvent);

      expect(blurSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should emit focus event', () => {
      const focusSpy = vi.fn();
      component.focusEvent.subscribe(focusSpy);

      const mockEvent = new FocusEvent('focus');
      component.handleFocus(mockEvent);

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

      const mockEvent = {
        target: { value: 'test' },
      } as any;
      component.handleInput(mockEvent);
      expect(onChangeSpy).toHaveBeenCalledWith('test');
    });

    it('should implement registerOnTouched', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      const mockEvent = new FocusEvent('blur');
      component.handleBlur(mockEvent);
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

      expect(component['hasError']()).toBe(true);
    });

    it('should compute appearance correctly', () => {
      expect(component['appearance']()).toBe('outline');
    });

    it('should compute hint class correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const hintClass = component.hintClass();
      expect(hintClass).toContain('os-form-field__hint');
      expect(hintClass).toContain('os-form-field__hint--small');
      expect(hintClass).toContain('os-form-field__hint--disabled');
    });
  });

  describe('accessibility', () => {
    it('should have unique input id', () => {
      const inputId = (component as unknown as { inputId: string }).inputId;
      expect(inputId).toMatch(/^os-form-field-/);
    });

    it('should generate different ids for different instances', () => {
      const fixture2 = TestBed.createComponent(OsFormFieldComponent);
      const component2 = fixture2.componentInstance;

      expect((component as unknown as { inputId: string }).inputId).not.toBe(
        (component2 as unknown as { inputId: string }).inputId
      );
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
});
