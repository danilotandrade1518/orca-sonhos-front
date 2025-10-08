import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsSelectComponent, OsSelectOption } from './os-select.component';
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
      imports: [OsSelectComponent, ReactiveFormsModule],
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
    });

    it('should render with custom props', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('label', 'Choose Option');
      fixture.componentRef.setInput('placeholder', 'Select an option');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('.os-select__label'));
      const select = fixture.debugElement.query(By.css('.os-select'));

      expect(label.nativeElement.textContent.trim()).toBe('Choose Option *');
      expect(select.nativeElement.required).toBe(true);
    });

    it('should render options', () => {
      const options = fixture.debugElement.queryAll(By.css('option'));
      expect(options.length).toBe(3); // 3 options (no placeholder by default)
    });

    it('should show placeholder option', () => {
      fixture.componentRef.setInput('placeholder', 'Select an option');
      fixture.detectChanges();

      const placeholderOption = fixture.debugElement.query(By.css('option[disabled]'));
      expect(placeholderOption.nativeElement.textContent.trim()).toBe('Select an option');
    });

    it('should show arrow indicator', () => {
      const arrow = fixture.debugElement.query(By.css('.os-select__arrow'));
      expect(arrow.nativeElement.textContent.trim()).toBe('▼');
    });
  });

  describe('option handling', () => {
    it('should render all options', () => {
      const options = fixture.debugElement.queryAll(By.css('option:not([value=""])'));
      expect(options.length).toBe(3);
    });

    it('should handle disabled options', () => {
      const disabledOption = fixture.debugElement.query(By.css('option[disabled]:not([value=""])'));
      expect(disabledOption.nativeElement.disabled).toBe(true);
    });

    it('should set selected value', () => {
      fixture.componentRef.setInput('value', 'option2');
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('.os-select'));
      expect(select.nativeElement.value).toBe('option2');
    });
  });

  describe('user interactions', () => {
    it('should emit value change on selection', () => {
      vi.spyOn(component.valueChange, 'emit');
      const select = fixture.debugElement.query(By.css('.os-select'));

      select.nativeElement.value = 'option2';
      select.nativeElement.dispatchEvent(new Event('change'));

      expect(component.valueChange.emit).toHaveBeenCalledWith('option2');
    });

    it('should emit blur event', () => {
      vi.spyOn(component.blurEvent, 'emit');
      const select = fixture.debugElement.query(By.css('.os-select'));

      select.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.blurEvent.emit).toHaveBeenCalled();
    });

    it('should emit focus event', () => {
      vi.spyOn(component.focusEvent, 'emit');
      const select = fixture.debugElement.query(By.css('.os-select'));

      select.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.focusEvent.emit).toHaveBeenCalled();
    });
  });

  describe('error states', () => {
    it('should show error message', () => {
      fixture.componentRef.setInput('errorMessage', 'Please select an option');
      fixture.detectChanges();

      const helper = fixture.debugElement.query(By.css('.os-select__helper'));
      expect(helper.nativeElement.textContent.trim()).toBe('Please select an option');
      expect(helper.nativeElement.classList.contains('os-select__helper--error')).toBe(true);
    });

    it('should apply error styling', () => {
      fixture.componentRef.setInput('errorMessage', 'Please select an option');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-select-container'));
      const select = fixture.debugElement.query(By.css('.os-select'));

      expect(container.nativeElement.classList.contains('os-select-container--error')).toBe(true);
      expect(select.nativeElement.classList.contains('os-select--error')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should be disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('.os-select'));
      const container = fixture.debugElement.query(By.css('.os-select-container'));

      expect(select.nativeElement.disabled).toBe(true);
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
      const select = fixture.debugElement.query(By.css('.os-select'));

      expect(container.nativeElement.classList.contains('os-select-container--small')).toBe(true);
      expect(select.nativeElement.classList.contains('os-select--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-select-container'));
      const select = fixture.debugElement.query(By.css('.os-select'));

      expect(container.nativeElement.classList.contains('os-select-container--large')).toBe(true);
      expect(select.nativeElement.classList.contains('os-select--large')).toBe(true);
    });
  });

  describe('form integration', () => {
    it('should work with reactive forms', () => {
      const formControl = new FormControl('option1');
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

      const select = fixture.debugElement.query(By.css('.os-select'));
      select.nativeElement.value = 'option2';
      select.nativeElement.dispatchEvent(new Event('change'));

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

      const select = fixture.debugElement.query(By.css('.os-select'));
      const label = fixture.debugElement.query(By.css('.os-select__label'));

      expect(select.nativeElement.getAttribute('aria-describedby')).toContain('helper');
      expect(label.nativeElement.getAttribute('for')).toBe(select.nativeElement.id);
    });

    it('should indicate required field', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const required = fixture.debugElement.query(By.css('.os-select__required'));
      expect(required.nativeElement.getAttribute('aria-label')).toBe('required');
    });

    it('should have proper select element', () => {
      const select = fixture.debugElement.query(By.css('.os-select'));
      expect(select.nativeElement.tagName.toLowerCase()).toBe('select');
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

      const options = fixture.debugElement.queryAll(By.css('option:not([disabled])'));
      expect(options.length).toBe(2);
    });

    it('should handle empty options', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('option:not([disabled])'));
      expect(options.length).toBe(0);
    });
  });
});
