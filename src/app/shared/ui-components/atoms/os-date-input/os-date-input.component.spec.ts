import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsDateInputComponent } from './os-date-input.component';
import { vi } from 'vitest';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';

describe('OsDateInputComponent', () => {
  let component: OsDateInputComponent;
  let fixture: ComponentFixture<OsDateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OsDateInputComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatIconModule,
        MatButtonModule,
        MatNativeDateModule,
      ],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDateInputComponent);
    component = fixture.componentInstance;
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
      fixture.componentRef.setInput('label', 'Birth Date');
      fixture.componentRef.setInput('placeholder', 'Select date');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('mat-label'));
      const input = fixture.debugElement.query(By.css('input[matInput]'));
      
      expect(label.nativeElement.textContent.trim()).toBe('Birth Date');
      expect(input.nativeElement.placeholder).toBe('Select date');
      expect(input.nativeElement.required).toBe(true);
    });

    it('should show prefix icon', () => {
      fixture.componentRef.setInput('prefixIcon', 'calendar');
      fixture.detectChanges();

      const prefixIcon = fixture.debugElement.query(By.css('os-icon[matPrefix]'));
      expect(prefixIcon).toBeTruthy();
      expect(prefixIcon.componentInstance.name()).toBe('calendar');
    });

    it('should show suffix icon', () => {
      fixture.componentRef.setInput('suffixIcon', 'calendar');
      fixture.detectChanges();

      const suffixIcon = fixture.debugElement.query(By.css('os-icon[matSuffix]'));
      expect(suffixIcon).toBeTruthy();
      expect(suffixIcon.componentInstance.name()).toBe('calendar');
    });
  });

  describe('date formatting', () => {
    it('should format date correctly for input', () => {
      const testDate = new Date(2024, 2, 15); 
      fixture.componentRef.setInput('value', testDate);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      
      expect(input.nativeElement.value).toContain('2024');
    });

    it('should handle null value', () => {
      fixture.componentRef.setInput('value', null);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.value).toBe('');
    });

    it('should handle invalid date', () => {
      const invalidDate = new Date('invalid');
      fixture.componentRef.setInput('value', invalidDate);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.value).toBe('');
    });
  });

  describe('user interactions', () => {
    it('should emit value change on input', () => {
      vi.spyOn(component.valueChange, 'emit');
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      input.nativeElement.value = '2024-03-15';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).toHaveBeenCalledWith(new Date('2024-03-15'));
    });

    it('should emit null for empty input', () => {
      vi.spyOn(component.valueChange, 'emit');
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      input.nativeElement.value = '';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).toHaveBeenCalledWith(null);
    });

    it('should emit blur event', () => {
      vi.spyOn(component.blurEvent, 'emit');
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      input.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.blurEvent.emit).toHaveBeenCalled();
    });

    it('should emit focus event', () => {
      vi.spyOn(component.focusEvent, 'emit');
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      input.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.focusEvent.emit).toHaveBeenCalled();
    });
  });

  describe('date constraints', () => {
    it('should set min date', () => {
      fixture.componentRef.setInput('minDate', '2024-01-01');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.min).toBe('2024-01-01');
    });

    it('should set max date', () => {
      fixture.componentRef.setInput('maxDate', '2024-12-31');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.max).toBe('2024-12-31');
    });
  });

  describe('error states', () => {
    it('should show error message', () => {
      fixture.componentRef.setInput('errorMessage', 'Invalid date');
      fixture.detectChanges();

      const helper = fixture.debugElement.query(By.css('.os-date-input__helper'));
      expect(helper.nativeElement.textContent.trim()).toBe('Invalid date');
      expect(helper.nativeElement.classList.contains('os-date-input__helper--error')).toBe(true);
    });

    it('should apply error styling', () => {
      fixture.componentRef.setInput('errorMessage', 'Invalid date');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-date-input-container'));
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      expect(container.nativeElement.classList.contains('os-date-input-container--error')).toBe(
        true
      );
      expect(input.nativeElement.classList.contains('os-date-input--error')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should be disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      const container = fixture.debugElement.query(By.css('.os-date-input-container'));

      expect(input.nativeElement.disabled).toBe(true);
      expect(container.nativeElement.classList.contains('os-date-input-container--disabled')).toBe(
        true
      );
    });
  });

  describe('readonly state', () => {
    it('should be readonly', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.classList.contains('os-date-input--readonly')).toBe(true);
    });
  });

  describe('sizes', () => {
    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-date-input-container'));
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      expect(container.nativeElement.classList.contains('os-date-input-container--small')).toBe(
        true
      );
      expect(input.nativeElement.classList.contains('os-date-input--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-date-input-container'));
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      expect(container.nativeElement.classList.contains('os-date-input-container--large')).toBe(
        true
      );
      expect(input.nativeElement.classList.contains('os-date-input--large')).toBe(true);
    });
  });

  describe('form integration', () => {
    it('should work with reactive forms', () => {
      const testDate = new Date('2024-03-15');
      fixture.componentRef.setInput('value', testDate);
      component.registerOnChange(() => {
        
      });
      component.registerOnTouched(() => {
        
      });

      expect(component.value()).toEqual(testDate);
    });

    it('should handle form control changes', () => {
      const formControl = new FormControl<Date | null>(null);
      component.writeValue(null);

      const newDate = new Date('2024-03-15');
      formControl.setValue(newDate);
      fixture.componentRef.setInput('value', newDate);
      fixture.detectChanges();

      expect(component.value()).toEqual(newDate);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      const testDate = new Date('2024-03-15');
      component.writeValue(testDate);
      expect(component.value()).toEqual(testDate);
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.disabled()).toBe(true);
    });

    it('should register onChange callback', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.value = '2024-03-15';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(onChangeSpy).toHaveBeenCalled();
    });

    it('should register onTouched callback', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Birth Date');
      fixture.componentRef.setInput('helperText', 'Select your birth date');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      const label = fixture.debugElement.query(By.css('mat-label'));

      expect(input.nativeElement.getAttribute('aria-describedby')).toContain('helper');
      
      expect(label).toBeTruthy();
    });

    it('should indicate required field', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      
      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.required).toBe(true);
    });

    it('should have proper input type', () => {
      const input = fixture.debugElement.query(By.css('input[matInput]'));
      
      expect(input.nativeElement.type).toBe('text');
    });

    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Birth Date');
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.componentRef.setInput('ariaDescribedBy', 'description');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.getAttribute('aria-label')).toBe('Custom label');
      expect(input.nativeElement.getAttribute('aria-describedby')).toBe('description');
      expect(input.nativeElement.getAttribute('aria-required')).toBe('true');
      
      expect(input.nativeElement.getAttribute('aria-disabled')).toBeNull();
      expect(input.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should have proper tabindex for disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should have proper aria-describedby with helper text', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.getAttribute('aria-describedby')).toContain('helper');
    });
  });

  describe('haptic feedback', () => {
    it('should trigger haptic feedback on input', () => {
      
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: vibrateSpy,
        writable: true,
      });

      fixture.componentRef.setInput('hapticFeedback', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.value = '2024-03-15';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(vibrateSpy).toHaveBeenCalledWith(50);
    });

    it('should not trigger haptic feedback when disabled', () => {
      
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: vibrateSpy,
        writable: true,
      });

      fixture.componentRef.setInput('hapticFeedback', false);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.value = '2024-03-15';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(vibrateSpy).not.toHaveBeenCalled();
    });
  });

  describe('focus and state tracking', () => {
    it('should track focus state', () => {
      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.isFocused()).toBe(true);
    });

    it('should track blur state', () => {
      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.isFocused()).toBe(false);
    });

    it('should track hover state', () => {
      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

      expect(component.isHovered()).toBe(true);
    });

    it('should track mouse leave state', () => {
      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));

      expect(component.isHovered()).toBe(false);
    });
  });
});
