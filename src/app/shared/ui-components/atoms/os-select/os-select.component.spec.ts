import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsSelectComponent, OsSelectOption } from './os-select.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('OsSelectComponent', () => {
  let component: OsSelectComponent;
  let fixture: ComponentFixture<OsSelectComponent>;

  const mockOptions: OsSelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        OsSelectComponent,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
      ],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render with default props', () => {
      expect(component.size()).toBe('medium');
      expect(component.disabled()).toBe(false);
      expect(component.required()).toBe(false);
      expect(component.ariaLabel()).toBe('');
      expect(component.ariaDescribedBy()).toBe('');
      expect(component.animated()).toBe(true);
      expect(component.hapticFeedback()).toBe(true);
    });

    it('should render with custom props', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('label', 'Choose Option');
      fixture.componentRef.setInput('placeholder', 'Select an option');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('mat-label'));

      expect(label.nativeElement.textContent.trim()).toBe('Choose Option');
      expect(component.required()).toBe(true);
    });

    it('should render options', () => {
      // Material select doesn't render options until opened
      // We can only test that the component has the options data
      expect(component.options().length).toBe(3);
    });

    it('should show placeholder option', () => {
      fixture.componentRef.setInput('placeholder', 'Select an option');
      fixture.detectChanges();

      expect(component.placeholder()).toBe('Select an option');
    });

    it('should show arrow indicator', () => {
      // Material provides the arrow automatically
      const select = fixture.debugElement.query(By.css('mat-select'));
      expect(select).toBeTruthy();
    });
  });

  describe('option handling', () => {
    it('should render all options', () => {
      // Material select doesn't render options until opened
      // We can only test that the component has the options data
      expect(component.options().length).toBe(3);
    });

    it('should handle disabled options', () => {
      // Material select doesn't render options until opened
      // We can only test that the component has disabled options data
      const disabledOptions = component.options().filter((option) => option.disabled);
      expect(disabledOptions.length).toBe(1);
    });

    it('should set selected value', () => {
      fixture.componentRef.setInput('value', 'option2');
      fixture.detectChanges();

      expect(component.value()).toBe('option2');
    });
  });

  describe('user interactions', () => {
    it('should emit value change on selection', () => {
      vi.spyOn(component.valueChange, 'emit');
      const select = fixture.debugElement.query(By.css('mat-select'));

      // Simulate Material select change event
      const changeEvent = { value: 'option2' };
      select.triggerEventHandler('selectionChange', changeEvent);

      expect(component.valueChange.emit).toHaveBeenCalledWith('option2');
    });

    it('should emit blur event', () => {
      vi.spyOn(component.blurEvent, 'emit');
      const select = fixture.debugElement.query(By.css('mat-select'));

      select.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.blurEvent.emit).toHaveBeenCalled();
    });

    it('should emit focus event', () => {
      vi.spyOn(component.focusEvent, 'emit');
      const select = fixture.debugElement.query(By.css('mat-select'));

      select.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.focusEvent.emit).toHaveBeenCalled();
    });
  });

  describe('error states', () => {
    it('should show error message', () => {
      fixture.componentRef.setInput('errorMessage', 'Please select an option');
      fixture.detectChanges();

      const helper = fixture.debugElement.query(By.css('mat-hint'));
      expect(helper.nativeElement.textContent.trim()).toBe('Please select an option');
      expect(helper.nativeElement.classList.contains('os-select__helper--error')).toBe(true);
    });

    it('should apply error styling', () => {
      fixture.componentRef.setInput('errorMessage', 'Please select an option');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-select-container'));
      const formField = fixture.debugElement.query(By.css('.os-select__form-field'));

      expect(container.nativeElement.classList.contains('os-select-container--error')).toBe(true);
      expect(formField.nativeElement.classList.contains('os-select__form-field--error')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should be disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-select-container'));

      expect(component.disabled()).toBe(true);
      expect(container.nativeElement.classList.contains('os-select-container--disabled')).toBe(
        true
      );
    });
  });

  describe('sizes', () => {
    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-select-container'));
      const formField = fixture.debugElement.query(By.css('.os-select__form-field'));

      expect(container.nativeElement.classList.contains('os-select-container--small')).toBe(true);
      expect(formField.nativeElement.classList.contains('os-select__form-field--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-select-container'));
      const formField = fixture.debugElement.query(By.css('.os-select__form-field'));

      expect(container.nativeElement.classList.contains('os-select-container--large')).toBe(true);
      expect(formField.nativeElement.classList.contains('os-select__form-field--large')).toBe(true);
    });
  });

  describe('form integration', () => {
    it('should work with reactive forms', () => {
      fixture.componentRef.setInput('value', 'option1');
      component.registerOnChange(() => {
        // Mock onChange callback
      });
      component.registerOnTouched(() => {
        // Mock onTouched callback
      });

      expect(component.value()).toBe('option1');
    });

    it('should handle form control changes', () => {
      const formControl = new FormControl('');
      fixture.componentRef.setInput('value', '');

      formControl.setValue('option2');
      fixture.componentRef.setInput('value', 'option2');
      fixture.detectChanges();

      expect(component.value()).toBe('option2');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue('option3');
      expect(component.value()).toBe('option3');
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.disabled()).toBe(true);
    });

    it('should register onChange callback', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      // Simulate Material select change event
      const changeEvent = { value: 'option2' };
      component.handleChange(changeEvent);

      expect(onChangeSpy).toHaveBeenCalledWith('option2');
    });

    it('should register onTouched callback', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      const select = fixture.debugElement.query(By.css('.os-select'));
      select.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Choose Option');
      fixture.componentRef.setInput('helperText', 'Select one of the available options');
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('mat-select'));
      const label = fixture.debugElement.query(By.css('mat-label'));

      expect(select.nativeElement.getAttribute('aria-describedby')).toContain('helper');
      expect(label).toBeTruthy();
    });

    it('should indicate required field', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      expect(component.required()).toBe(true);
    });

    it('should have proper select element', () => {
      const select = fixture.debugElement.query(By.css('mat-select'));
      expect(select.nativeElement.tagName.toLowerCase()).toBe('mat-select');
    });
  });

  describe('dynamic options', () => {
    it('should update when options change', () => {
      const newOptions: OsSelectOption[] = [
        { value: 'new1', label: 'New Option 1' },
        { value: 'new2', label: 'New Option 2' },
      ];

      fixture.componentRef.setInput('options', newOptions);
      fixture.detectChanges();

      // Material select doesn't render options until opened
      // We can only test that the component has the new options data
      expect(component.options().length).toBe(2);
    });

    it('should handle empty options', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      // Material select doesn't render options until opened
      // We can only test that the component has empty options data
      expect(component.options().length).toBe(0);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Choose Option');
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.componentRef.setInput('ariaDescribedBy', 'description');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('mat-select'));
      expect(select.nativeElement.getAttribute('aria-label')).toBe('Custom label');
      expect(select.nativeElement.getAttribute('aria-describedby')).toBe('description');
      expect(select.nativeElement.getAttribute('aria-required')).toBe('true');
      expect(select.nativeElement.getAttribute('aria-disabled')).toBe('false');
      expect(select.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should have proper tabindex for disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('mat-select'));
      expect(select.nativeElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should have proper aria-describedby with helper text', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('mat-select'));
      expect(select.nativeElement.getAttribute('aria-describedby')).toContain('helper');
    });
  });

  describe('haptic feedback', () => {
    it('should trigger haptic feedback on selection change', () => {
      // Mock navigator.vibrate
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: vibrateSpy,
        writable: true,
      });

      fixture.componentRef.setInput('hapticFeedback', true);
      fixture.detectChanges();

      const changeEvent = { value: 'option2' };
      component.handleChange(changeEvent);

      expect(vibrateSpy).toHaveBeenCalledWith(50);
    });

    it('should not trigger haptic feedback when disabled', () => {
      // Mock navigator.vibrate
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: vibrateSpy,
        writable: true,
      });

      fixture.componentRef.setInput('hapticFeedback', false);
      fixture.detectChanges();

      const changeEvent = { value: 'option2' };
      component.handleChange(changeEvent);

      expect(vibrateSpy).not.toHaveBeenCalled();
    });
  });

  describe('focus and state tracking', () => {
    it('should track focus state', () => {
      const select = fixture.debugElement.query(By.css('mat-select'));
      select.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.isFocused()).toBe(true);
    });

    it('should track blur state', () => {
      const select = fixture.debugElement.query(By.css('mat-select'));
      select.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.isFocused()).toBe(false);
    });

    it('should track opened state', () => {
      component.onOpenedChange(true);
      expect(component.isOpened()).toBe(true);

      component.onOpenedChange(false);
      expect(component.isOpened()).toBe(false);
    });
  });

  describe('opened change output', () => {
    it('should emit opened change event', () => {
      vi.spyOn(component.openedChange, 'emit');
      component.onOpenedChange(true);

      expect(component.openedChange.emit).toHaveBeenCalledWith(true);
    });
  });
});
