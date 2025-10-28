import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { OsMoneyInputComponent } from './os-money-input.component';
import { vi } from 'vitest';

describe('OsMoneyInputComponent', () => {
  let component: OsMoneyInputComponent;
  let fixture: ComponentFixture<OsMoneyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OsMoneyInputComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
      ],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsMoneyInputComponent);
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
    });

    it('should render with custom props', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('label', 'Amount');
      fixture.componentRef.setInput('placeholder', 'Enter amount');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('mat-label'));
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      expect(label.nativeElement.textContent.trim()).toBe('Amount');
      expect(input.nativeElement.placeholder).toBe('Enter amount');
      expect(input.nativeElement.required).toBe(true);
    });

    it('should show currency symbol', () => {
      const currency = fixture.debugElement.query(By.css('.os-money-input__currency-icon'));
      expect(currency).toBeTruthy();
      expect(currency.componentInstance.name()).toBe('attach_money');
    });
  });

  describe('value formatting', () => {
    it('should format currency correctly', () => {
      fixture.componentRef.setInput('value', 1234.56);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.value).toBe('1.234,56');
    });

    it('should handle zero value', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.value).toBe('0,00');
    });

    it('should show placeholder when value is 0 and no placeholder set', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.componentRef.setInput('placeholder', '');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.value).toBe('');
    });
  });

  describe('user interactions', () => {
    it('should emit value change on input', () => {
      vi.spyOn(component.valueChange, 'emit');
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      input.nativeElement.value = '1234,56';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).toHaveBeenCalledWith(1234.56);
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

  describe('error states', () => {
    it('should show error message', () => {
      fixture.componentRef.setInput('errorMessage', 'Invalid amount');
      fixture.detectChanges();

      const helper = fixture.debugElement.query(By.css('mat-hint'));
      expect(helper.nativeElement.textContent.trim()).toBe('Invalid amount');
      expect(helper.nativeElement.classList.contains('os-money-input__helper--error')).toBe(true);
    });

    it('should apply error styling', () => {
      fixture.componentRef.setInput('errorMessage', 'Invalid amount');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-money-input-container'));
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      expect(container.nativeElement.classList.contains('os-money-input-container--error')).toBe(
        true
      );
      expect(input.nativeElement.classList.contains('os-money-input--error')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should be disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      const container = fixture.debugElement.query(By.css('.os-money-input-container'));

      expect(input.nativeElement.disabled).toBe(true);
      expect(container.nativeElement.classList.contains('os-money-input-container--disabled')).toBe(
        true
      );
    });
  });

  describe('readonly state', () => {
    it('should be readonly', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.classList.contains('os-money-input--readonly')).toBe(true);
    });
  });

  describe('sizes', () => {
    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-money-input-container'));
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      expect(container.nativeElement.classList.contains('os-money-input-container--small')).toBe(
        true
      );
      expect(input.nativeElement.classList.contains('os-money-input--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-money-input-container'));
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      expect(container.nativeElement.classList.contains('os-money-input-container--large')).toBe(
        true
      );
      expect(input.nativeElement.classList.contains('os-money-input--large')).toBe(true);
    });
  });

  describe('ControlValueAccessor integration', () => {
    it('should register onChange callback', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.value = '123,45';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(onChangeSpy).toHaveBeenCalledWith(123.45);
    });

    it('should register onTouched callback', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should update value when writeValue is called', () => {
      const initialValue = component.value();
      const newValue = 999.99;

      component.writeValue(newValue);

      expect(component.value()).toBe(newValue);
      expect(component.value()).not.toBe(initialValue);
    });

    it('should not update value if writeValue receives same value', () => {
      const currentValue = 100.5;
      component.value.set(currentValue);

      const setSpy = vi.spyOn(component.value, 'set');

      component.writeValue(currentValue);

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should update disabled state when setDisabledState is called', () => {
      expect(component.disabled()).toBe(false);

      component.setDisabledState(true);
      expect(component.disabled()).toBe(true);

      component.setDisabledState(false);
      expect(component.disabled()).toBe(false);
    });
  });

  describe('form integration', () => {
    it('should work with reactive forms', () => {
      fixture.componentRef.setInput('value', 100.5);
      component.registerOnChange(() => {});
      component.registerOnTouched(() => {});

      expect(component.value()).toBe(100.5);
    });

    it('should handle form control changes through writeValue', () => {
      const formControl = new FormControl(0);

      formControl.setValue(250.75);
      component.writeValue(250.75);
      fixture.detectChanges();

      expect(component.value()).toBe(250.75);
    });

    it('should handle form control disabled state', () => {
      const formControl = new FormControl(100);

      formControl.disable();
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(component.disabled()).toBe(true);

      formControl.enable();
      component.setDisabledState(false);
      fixture.detectChanges();

      expect(component.disabled()).toBe(false);
    });

    it('should integrate with FormControl bidirectionally', () => {
      const formControl = new FormControl(50.25);

      component.registerOnChange((value: number) => {
        formControl.setValue(value, { emitEvent: false });
      });
      component.registerOnTouched(() => {});

      component.writeValue(75.5);
      expect(component.value()).toBe(75.5);

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.value = '100,75';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(formControl.value).toBe(100.75);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Amount');
      fixture.componentRef.setInput('helperText', 'Enter the amount');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));

      expect(input.nativeElement.getAttribute('aria-describedby')).toContain('helper');
      expect(input.nativeElement.id).toBeTruthy();
    });

    it('should indicate required field', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.required).toBe(true);
    });
  });

  describe('enhanced formatting', () => {
    it('should support quick entry for cents', () => {
      vi.spyOn(component.valueChange, 'emit');
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      input.nativeElement.value = '100';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).toHaveBeenCalledWith(1.0);
    });

    it('should highlight large values visually', () => {
      fixture.componentRef.setInput('value', 15000.0);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.classList.contains('os-money-input--large-value')).toBe(true);
    });

    it('should apply real-time input mask', () => {
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      input.nativeElement.value = '1234';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(input.nativeElement.value).toBe('12,34');
    });

    it('should validate negative values when allowed', () => {
      vi.spyOn(component.valueChange, 'emit');
      fixture.componentRef.setInput('allowNegative', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.value = '-100,50';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).toHaveBeenCalledWith(-100.5);
    });

    it('should prevent negative values when not allowed', () => {
      vi.spyOn(component.valueChange, 'emit');
      fixture.componentRef.setInput('allowNegative', false);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      input.nativeElement.value = '-100,50';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).not.toHaveBeenCalledWith(-100.5);
    });
  });

  describe('mobile accessibility', () => {
    it('should have touch targets >= 44px', () => {
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      const computedStyle = window.getComputedStyle(input.nativeElement);
      const minHeight = parseInt(computedStyle.minHeight) || 0;

      expect(minHeight).toBeGreaterThanOrEqual(44);
    });

    it('should have proper ARIA labels for screen readers', () => {
      fixture.componentRef.setInput('label', 'Valor monetário');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.getAttribute('aria-label')).toContain('Valor monetário');
    });

    it('should announce value changes to screen readers', () => {
      fixture.componentRef.setInput('value', 1000.5);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.getAttribute('aria-valuenow')).toBe('1000.5');
    });
  });

  describe('micro-interactions', () => {
    it('should show loading state during formatting', () => {
      fixture.componentRef.setInput('isFormatting', true);
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-money-input-container'));
      expect(
        container.nativeElement.classList.contains('os-money-input-container--formatting')
      ).toBe(true);
    });

    it('should animate value changes', () => {
      const input = fixture.debugElement.query(By.css('input[matInput]'));

      input.nativeElement.value = '1000,00';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.isFormatting()).toBe(true);
    });

    it('should show success state for valid large values', () => {
      fixture.componentRef.setInput('value', 50000.0);
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-money-input-container'));
      expect(container.nativeElement.classList.contains('os-money-input-container--success')).toBe(
        true
      );
    });
  });

  describe('currency formatting edge cases', () => {
    it('should handle very large numbers correctly', () => {
      fixture.componentRef.setInput('value', 999999999.99);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.value).toBe('999.999.999,99');
    });

    it('should handle decimal precision correctly', () => {
      fixture.componentRef.setInput('value', 123.456);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.value).toBe('123,46');
    });

    it('should handle zero values correctly', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[matInput]'));
      expect(input.nativeElement.value).toBe('0,00');
    });
  });
});
