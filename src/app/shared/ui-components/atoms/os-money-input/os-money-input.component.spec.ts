import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsMoneyInputComponent } from './os-money-input.component';
import { vi } from 'vitest';

describe('OsMoneyInputComponent', () => {
  let component: OsMoneyInputComponent;
  let fixture: ComponentFixture<OsMoneyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsMoneyInputComponent, ReactiveFormsModule],
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

      const label = fixture.debugElement.query(By.css('.os-money-input__label'));
      const input = fixture.debugElement.query(By.css('.os-money-input'));

      expect(label.nativeElement.textContent.trim()).toBe('Amount *');
      expect(input.nativeElement.placeholder).toBe('Enter amount');
      expect(input.nativeElement.required).toBe(true);
    });

    it('should show currency symbol', () => {
      const currency = fixture.debugElement.query(By.css('.os-money-input__currency'));
      expect(currency.nativeElement.textContent.trim()).toBe('R$');
    });
  });

  describe('value formatting', () => {
    it('should format currency correctly', () => {
      fixture.componentRef.setInput('value', 1234.56);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('.os-money-input'));
      expect(input.nativeElement.value).toBe('1.234,56');
    });

    it('should handle zero value', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('.os-money-input'));
      expect(input.nativeElement.value).toBe('0,00');
    });

    it('should show placeholder when value is 0 and no placeholder set', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.componentRef.setInput('placeholder', '');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('.os-money-input'));
      expect(input.nativeElement.value).toBe('');
    });
  });

  describe('user interactions', () => {
    it('should emit value change on input', () => {
      vi.spyOn(component.valueChange, 'emit');
      const input = fixture.debugElement.query(By.css('.os-money-input'));

      input.nativeElement.value = '1234,56';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).toHaveBeenCalledWith(1234.56);
    });

    it('should emit blur event', () => {
      vi.spyOn(component.blur, 'emit');
      const input = fixture.debugElement.query(By.css('.os-money-input'));

      input.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.blur.emit).toHaveBeenCalled();
    });

    it('should emit focus event', () => {
      vi.spyOn(component.focus, 'emit');
      const input = fixture.debugElement.query(By.css('.os-money-input'));

      input.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.focus.emit).toHaveBeenCalled();
    });
  });

  describe('error states', () => {
    it('should show error message', () => {
      fixture.componentRef.setInput('errorMessage', 'Invalid amount');
      fixture.detectChanges();

      const helper = fixture.debugElement.query(By.css('.os-money-input__helper'));
      expect(helper.nativeElement.textContent.trim()).toBe('Invalid amount');
      expect(helper.nativeElement.classList.contains('os-money-input__helper--error')).toBe(true);
    });

    it('should apply error styling', () => {
      fixture.componentRef.setInput('errorMessage', 'Invalid amount');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-money-input-container'));
      const input = fixture.debugElement.query(By.css('.os-money-input'));

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

      const input = fixture.debugElement.query(By.css('.os-money-input'));
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

      const input = fixture.debugElement.query(By.css('.os-money-input'));
      expect(input.nativeElement.classList.contains('os-money-input--readonly')).toBe(true);
    });
  });

  describe('sizes', () => {
    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-money-input-container'));
      const input = fixture.debugElement.query(By.css('.os-money-input'));

      expect(container.nativeElement.classList.contains('os-money-input-container--small')).toBe(
        true
      );
      expect(input.nativeElement.classList.contains('os-money-input--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-money-input-container'));
      const input = fixture.debugElement.query(By.css('.os-money-input'));

      expect(container.nativeElement.classList.contains('os-money-input-container--large')).toBe(
        true
      );
      expect(input.nativeElement.classList.contains('os-money-input--large')).toBe(true);
    });
  });

  describe('form integration', () => {
    it('should work with reactive forms', () => {
      component.writeValue(100.5);
      component.registerOnChange(() => {});
      component.registerOnTouched(() => {});

      expect(component.value()).toBe(100.5);
    });

    it('should handle form control changes', () => {
      const formControl = new FormControl(0);
      component.writeValue(0);

      formControl.setValue(250.75);
      component.writeValue(250.75);
      fixture.detectChanges();

      expect(component.value()).toBe(250.75);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Amount');
      fixture.componentRef.setInput('helperText', 'Enter the amount');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('.os-money-input'));
      const label = fixture.debugElement.query(By.css('.os-money-input__label'));

      expect(input.nativeElement.getAttribute('aria-describedby')).toContain('helper');
      expect(label.nativeElement.getAttribute('for')).toBe(input.nativeElement.id);
    });

    it('should indicate required field', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const required = fixture.debugElement.query(By.css('.os-money-input__required'));
      expect(required.nativeElement.getAttribute('aria-label')).toBe('required');
    });
  });
});
