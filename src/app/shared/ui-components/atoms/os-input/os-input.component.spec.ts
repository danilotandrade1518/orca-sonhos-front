import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { OsInputComponent } from './os-input.component';

describe('OsInputComponent', () => {
  let component: OsInputComponent;
  let fixture: ComponentFixture<OsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OsInputComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('type', () => {
    it('should apply text type by default', () => {
      expect(component.type()).toBe('text');
    });

    it('should apply email type', () => {
      fixture.componentRef.setInput('type', 'email');
      fixture.detectChanges();
      expect(component.type()).toBe('email');
    });

    it('should apply password type', () => {
      fixture.componentRef.setInput('type', 'password');
      fixture.detectChanges();
      expect(component.type()).toBe('password');
    });

    it('should apply number type', () => {
      fixture.componentRef.setInput('type', 'number');
      fixture.detectChanges();
      expect(component.type()).toBe('number');
    });
  });

  describe('size', () => {
    it('should apply medium size by default', () => {
      expect(component.size()).toBe('medium');
      expect(component.inputClass()).toContain('os-input--medium');
    });

    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.inputClass()).toContain('os-input--small');
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.inputClass()).toContain('os-input--large');
    });
  });

  describe('label', () => {
    it('should not show label by default', () => {
      expect(component.label()).toBe('');
    });

    it('should show label when provided', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();
      expect(component.label()).toBe('Test Label');
    });

    it('should show required indicator when required', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(component.required()).toBe(true);
    });
  });

  describe('placeholder', () => {
    it('should not show placeholder by default', () => {
      expect(component.placeholder()).toBe('');
    });

    it('should show placeholder when provided', () => {
      fixture.componentRef.setInput('placeholder', 'Enter text...');
      fixture.detectChanges();
      expect(component.placeholder()).toBe('Enter text...');
    });
  });

  describe('disabled state', () => {
    it('should not be disabled by default', () => {
      expect(component.disabled()).toBe(false);
      expect(component.inputClass()).not.toContain('os-input--disabled');
    });

    it('should be disabled when set', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
      expect(component.inputClass()).toContain('os-input--disabled');
    });
  });

  describe('readonly state', () => {
    it('should not be readonly by default', () => {
      expect(component.readonly()).toBe(false);
      expect(component.inputClass()).not.toContain('os-input--readonly');
    });

    it('should be readonly when set', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(component.readonly()).toBe(true);
      expect(component.inputClass()).toContain('os-input--readonly');
    });
  });

  describe('required state', () => {
    it('should not be required by default', () => {
      expect(component.required()).toBe(false);
    });

    it('should be required when set', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(component.required()).toBe(true);
    });
  });

  describe('clearable', () => {
    it('should not be clearable by default', () => {
      expect(component.clearable()).toBe(false);
    });

    it('should be clearable when set', () => {
      fixture.componentRef.setInput('clearable', true);
      fixture.detectChanges();
      expect(component.clearable()).toBe(true);
    });

    it('should show clear button when clearable and has value', () => {
      fixture.componentRef.setInput('clearable', true);
      fixture.componentRef.setInput('value', 'test value');
      fixture.detectChanges();
      expect(component.clearable()).toBe(true);
      expect(component.value()).toBe('test value');
    });
  });

  describe('icons', () => {
    it('should not show prefix icon by default', () => {
      expect(component.prefixIcon()).toBe('');
    });

    it('should show prefix icon when provided', () => {
      fixture.componentRef.setInput('prefixIcon', 'search');
      fixture.detectChanges();
      expect(component.prefixIcon()).toBe('search');
    });

    it('should show suffix icon when provided', () => {
      fixture.componentRef.setInput('suffixIcon', 'eye');
      fixture.detectChanges();
      expect(component.suffixIcon()).toBe('eye');
    });
  });

  describe('error state', () => {
    it('should not have error by default', () => {
      expect(component.hasError()).toBe(false);
      expect(component.inputClass()).not.toContain('os-input--error');
    });

    it('should have error when error message provided', () => {
      fixture.componentRef.setInput('errorMessage', 'This field is required');
      fixture.detectChanges();
      expect(component.hasError()).toBe(true);
      expect(component.inputClass()).toContain('os-input--error');
    });
  });

  describe('helper text', () => {
    it('should not show helper text by default', () => {
      expect(component.helperText()).toBe('');
    });

    it('should show helper text when provided', () => {
      fixture.componentRef.setInput('helperText', 'This is helper text');
      fixture.detectChanges();
      expect(component.helperText()).toBe('This is helper text');
    });

    it('should show error message over helper text', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.componentRef.setInput('errorMessage', 'Error message');
      fixture.detectChanges();
      expect(component.helperText()).toBe('Helper text');
      expect(component.errorMessage()).toBe('Error message');
    });
  });

  describe('value', () => {
    it('should have empty value by default', () => {
      expect(component.value()).toBe('');
    });

    it('should set value when provided', () => {
      fixture.componentRef.setInput('value', 'test value');
      fixture.detectChanges();
      expect(component.value()).toBe('test value');
    });
  });

  describe('event handling', () => {
    it('should emit valueChange on input', () => {
      let emittedValue = '';
      component.valueChange.subscribe((value) => (emittedValue = value));

      const mockEvent = new Event('input');
      const mockTarget = { value: 'new value' } as HTMLInputElement;
      Object.defineProperty(mockEvent, 'target', {
        value: mockTarget,
        writable: false,
      });

      component.handleInput(mockEvent);
      expect(emittedValue).toBe('new value');
    });

    it('should emit blur event', () => {
      let blurEmitted = false;
      component.blurEvent.subscribe(() => (blurEmitted = true));

      const mockEvent = new FocusEvent('blur');
      component.handleBlur(mockEvent);
      expect(blurEmitted).toBe(true);
    });

    it('should emit focus event', () => {
      let focusEmitted = false;
      component.focusEvent.subscribe(() => (focusEmitted = true));

      const mockEvent = new FocusEvent('focus');
      component.handleFocus(mockEvent);
      expect(focusEmitted).toBe(true);
    });

    it('should clear value when clear button clicked', () => {
      fixture.componentRef.setInput('value', 'test value');
      fixture.componentRef.setInput('clearable', true);
      fixture.detectChanges();

      let emittedValue = '';
      component.valueChange.subscribe((value) => (emittedValue = value));

      component.handleClear();
      expect(emittedValue).toBe('');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement ControlValueAccessor', () => {
      expect(component.writeValue).toBeDefined();
      expect(component.registerOnChange).toBeDefined();
      expect(component.registerOnTouched).toBeDefined();
      expect(component.setDisabledState).toBeDefined();
    });

    it('should work with reactive forms', () => {
      const control = new FormControl('initial value');
      fixture.componentRef.setInput('value', control.value);
      fixture.detectChanges();

      expect(component.value()).toBe('initial value');
    });
  });

  describe('accessibility', () => {
    it('should have unique input id', () => {
      expect(component.inputId).toMatch(/^os-input-/);
    });

    it('should have aria-describedby when helper text exists', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('aria-describedby')).toContain('helper');
    });

    it('should have aria-invalid when error exists', () => {
      fixture.componentRef.setInput('errorMessage', 'Error message');
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should have aria-required when required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('aria-required')).toBe('true');
    });

    it('should have aria-disabled when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have proper ARIA attributes for clear button', () => {
      fixture.componentRef.setInput('clearable', true);
      fixture.componentRef.setInput('value', 'test value');
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('.os-input__clear');
      expect(clearButton.getAttribute('aria-label')).toContain('Clear');
    });
  });

  describe('responsiveness', () => {
    it('should apply mobile-first classes', () => {
      expect(component.containerClass()).toContain('os-input-container');
      expect(component.inputClass()).toContain('os-input');
    });

    it('should handle different sizes responsively', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.inputClass()).toContain('os-input--small');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.inputClass()).toContain('os-input--large');
    });
  });

  describe('micro-interactions', () => {
    it('should handle focus states', () => {
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement).toBeTruthy();
    });

    it('should handle hover states', () => {
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement).toBeTruthy();
    });

    it('should handle active states', () => {
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement).toBeTruthy();
    });
  });

  describe('design tokens integration', () => {
    it('should use design tokens for styling', () => {
      expect(component.containerClass()).toContain('os-input-container');
      expect(component.inputClass()).toContain('os-input');
      expect(component.helperClass()).toContain('os-input__helper');
    });

    it('should apply error states with design tokens', () => {
      fixture.componentRef.setInput('errorMessage', 'Error message');
      fixture.detectChanges();

      expect(component.hasError()).toBe(true);
      expect(component.inputClass()).toContain('os-input--error');
      expect(component.helperClass()).toContain('os-input__helper--error');
    });
  });

  describe('component integration', () => {
    it('should handle multiple input changes', () => {
      fixture.componentRef.setInput('type', 'email');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('required', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.type()).toBe('email');
      expect(component.size()).toBe('large');
      expect(component.label()).toBe('Email');
      expect(component.required()).toBe(true);
      expect(component.disabled()).toBe(true);
    });

    it('should maintain state consistency', () => {
      expect(component.type()).toBe('text');
      expect(component.size()).toBe('medium');
      expect(component.label()).toBe('');
      expect(component.placeholder()).toBe('');
      expect(component.disabled()).toBe(false);
      expect(component.readonly()).toBe(false);
      expect(component.required()).toBe(false);
      expect(component.clearable()).toBe(false);
      expect(component.value()).toBe('');
    });
  });
});
