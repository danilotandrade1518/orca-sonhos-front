import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsSliderComponent } from './os-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { vi } from 'vitest';

describe('OsSliderComponent', () => {
  let component: OsSliderComponent;
  let fixture: ComponentFixture<OsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsSliderComponent, ReactiveFormsModule, MatSliderModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsSliderComponent);
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
      expect(component.min()).toBe(0);
      expect(component.max()).toBe(100);
      expect(component.step()).toBe(1);
    });

    it('should render with custom props', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('label', 'Volume');
      fixture.componentRef.setInput('min', 0);
      fixture.componentRef.setInput('max', 100);
      fixture.componentRef.setInput('step', 5);
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('.os-slider__label'));
      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));

      expect(label.nativeElement.textContent.trim()).toBe('Volume *');
      expect(sliderInput.nativeElement.getAttribute('min')).toBe('0');
      expect(sliderInput.nativeElement.getAttribute('max')).toBe('100');
      expect(sliderInput.nativeElement.getAttribute('step')).toBe('5');
    });

    it('should show value display when enabled', () => {
      fixture.componentRef.setInput('showValue', true);
      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('decimals', 0);
      fixture.detectChanges();

      const valueDisplay = fixture.debugElement.query(By.css('.os-slider__value-display'));
      expect(valueDisplay.nativeElement.textContent.trim()).toBe('50');
    });

    it('should hide value display when disabled', () => {
      fixture.componentRef.setInput('showValue', false);
      fixture.detectChanges();

      const valueDisplay = fixture.debugElement.query(By.css('.os-slider__value-display'));
      expect(valueDisplay).toBeFalsy();
    });

    it('should show min/max labels when enabled', () => {
      fixture.componentRef.setInput('showMinMax', true);
      fixture.componentRef.setInput('min', 0);
      fixture.componentRef.setInput('max', 100);
      fixture.componentRef.setInput('decimals', 0);
      fixture.detectChanges();

      const minValue = fixture.debugElement.query(By.css('.os-slider__min-value'));
      const maxValue = fixture.debugElement.query(By.css('.os-slider__max-value'));

      expect(minValue.nativeElement.textContent.trim()).toBe('0');
      expect(maxValue.nativeElement.textContent.trim()).toBe('100');
    });
  });

  describe('value handling', () => {
    it('should display current value', () => {
      fixture.componentRef.setInput('value', 75);
      fixture.detectChanges();

      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));
      expect(sliderInput.nativeElement.value).toBe('75');
    });

    it('should handle decimal values', () => {
      fixture.componentRef.setInput('value', 25.5);
      fixture.componentRef.setInput('step', 0.5);
      fixture.detectChanges();

      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));
      expect(sliderInput.nativeElement.value).toBe('25.5');
    });
  });

  describe('user interactions', () => {
    it('should emit value change on input', () => {
      vi.spyOn(component.valueChange, 'emit');
      const slider = fixture.debugElement.query(By.css('mat-slider'));
      
      const changeEvent = new Event('change');
      Object.defineProperty(changeEvent, 'target', {
        value: { value: '75' },
        writable: false,
      });
      slider.nativeElement.dispatchEvent(changeEvent);

      expect(component.valueChange.emit).toHaveBeenCalledWith(75);
    });

    it('should emit blur event', () => {
      vi.spyOn(component.blurEvent, 'emit');
      const slider = fixture.debugElement.query(By.css('mat-slider'));

      slider.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.blurEvent.emit).toHaveBeenCalled();
    });

    it('should emit focus event', () => {
      vi.spyOn(component.focusEvent, 'emit');
      const slider = fixture.debugElement.query(By.css('mat-slider'));

      slider.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.focusEvent.emit).toHaveBeenCalled();
    });
  });

  describe('range constraints', () => {
    it('should set min value', () => {
      fixture.componentRef.setInput('min', 10);
      fixture.detectChanges();

      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));
      expect(sliderInput.nativeElement.getAttribute('min')).toBe('10');
    });

    it('should set max value', () => {
      fixture.componentRef.setInput('max', 90);
      fixture.detectChanges();

      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));
      expect(sliderInput.nativeElement.getAttribute('max')).toBe('90');
    });

    it('should set step value', () => {
      fixture.componentRef.setInput('step', 5);
      fixture.detectChanges();

      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));
      expect(sliderInput.nativeElement.getAttribute('step')).toBe('5');
    });
  });

  describe('error states', () => {
    it('should show error message', () => {
      fixture.componentRef.setInput('errorMessage', 'Value out of range');
      fixture.detectChanges();

      const helper = fixture.debugElement.query(By.css('.os-slider__helper'));
      expect(helper.nativeElement.textContent.trim()).toBe('Value out of range');
      expect(helper.nativeElement.classList.contains('os-slider__helper--error')).toBe(true);
    });

    it('should apply error styling', () => {
      fixture.componentRef.setInput('errorMessage', 'Value out of range');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-slider-container'));
      const slider = fixture.debugElement.query(By.css('mat-slider'));

      expect(container.nativeElement.classList.contains('os-slider-container--error')).toBe(true);
      expect(slider.nativeElement.classList.contains('os-slider--error')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should be disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));
      const container = fixture.debugElement.query(By.css('.os-slider-container'));

      expect(sliderInput.nativeElement.getAttribute('disabled')).toBe('');
      expect(container.nativeElement.classList.contains('os-slider-container--disabled')).toBe(
        true
      );
    });
  });

  describe('sizes', () => {
    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-slider-container'));
      const slider = fixture.debugElement.query(By.css('mat-slider'));

      expect(container.nativeElement.classList.contains('os-slider-container--small')).toBe(true);
      expect(slider.nativeElement.classList.contains('os-slider--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-slider-container'));
      const slider = fixture.debugElement.query(By.css('mat-slider'));

      expect(container.nativeElement.classList.contains('os-slider-container--large')).toBe(true);
      expect(slider.nativeElement.classList.contains('os-slider--large')).toBe(true);
    });
  });

  describe('form integration', () => {
    it('should work with reactive forms', () => {
      fixture.componentRef.setInput('value', 50);
      component.registerOnChange(() => {
        
      });
      component.registerOnTouched(() => {
        
      });

      expect(component.value()).toBe(50);
    });

    it('should handle form control changes', () => {
      const formControl = new FormControl(0);
      fixture.componentRef.setInput('value', 0);

      formControl.setValue(75);
      fixture.componentRef.setInput('value', 75);
      fixture.detectChanges();

      expect(component.value()).toBe(75);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue(42);
      expect(component.value()).toBe(42);
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.disabled()).toBe(true);
    });

    it('should register onChange callback', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      
      const changeEvent = new Event('change');
      Object.defineProperty(changeEvent, 'target', {
        value: { value: '30' },
        writable: false,
      });
      slider.nativeElement.dispatchEvent(changeEvent);

      expect(onChangeSpy).toHaveBeenCalledWith(30);
    });

    it('should register onTouched callback', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      slider.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Volume');
      fixture.componentRef.setInput('helperText', 'Adjust the volume level');
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      const label = fixture.debugElement.query(By.css('.os-slider__label'));

      expect(slider.nativeElement.getAttribute('aria-describedby')).toContain('helper');
      expect(label.nativeElement.getAttribute('for')).toBe(slider.nativeElement.id);
    });

    it('should indicate required field', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const required = fixture.debugElement.query(By.css('.os-slider__required'));
      expect(required.nativeElement.getAttribute('aria-label')).toBe('required');
    });

    it('should have proper input type', () => {
      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));
      expect(sliderInput.nativeElement.type).toBe('range');
    });

    it('should use custom aria label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom slider label');
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      expect(slider.nativeElement.getAttribute('aria-label')).toBe('Custom slider label');
    });

    it('should have proper ARIA value attributes', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('min', 0);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      const sliderInput = fixture.debugElement.query(By.css('input[matSliderThumb]'));

      expect(slider.nativeElement.getAttribute('aria-valuenow')).toBe('50');
      expect(slider.nativeElement.getAttribute('aria-valuemin')).toBe('0');
      expect(slider.nativeElement.getAttribute('aria-valuemax')).toBe('100');
      expect(sliderInput.nativeElement.getAttribute('aria-valuenow')).toBe('50');
      expect(sliderInput.nativeElement.getAttribute('aria-valuemin')).toBe('0');
      expect(sliderInput.nativeElement.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should have proper role attribute', () => {
      fixture.componentRef.setInput('role', 'progressbar');
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      expect(slider.nativeElement.getAttribute('role')).toBe('progressbar');
    });

    it('should have proper tabindex for disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      expect(slider.nativeElement.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('value display positioning', () => {
    it('should position value display correctly', () => {
      fixture.componentRef.setInput('showValue', true);
      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('decimals', 0);
      fixture.detectChanges();

      const valueDisplay = fixture.debugElement.query(By.css('.os-slider__value-display'));
      expect(valueDisplay.nativeElement.textContent.trim()).toBe('50');
    });
  });

  describe('value formatting', () => {
    it('should format currency values correctly', () => {
      fixture.componentRef.setInput('format', 'currency');
      fixture.componentRef.setInput('value', 1234.56);
      fixture.componentRef.setInput('currency', 'BRL');
      fixture.detectChanges();

      const valueDisplay = fixture.debugElement.query(By.css('.os-slider__value-display'));
      
      expect(valueDisplay.nativeElement.textContent.trim()).toBe(
        'R$ 1.234,56'.replace(' ', '\u00A0')
      );
    });

    it('should format percentage values correctly', () => {
      fixture.componentRef.setInput('format', 'percentage');
      fixture.componentRef.setInput('value', 75);
      fixture.componentRef.setInput('decimals', 0);
      fixture.detectChanges();

      const valueDisplay = fixture.debugElement.query(By.css('.os-slider__value-display'));
      expect(valueDisplay.nativeElement.textContent.trim()).toBe('75%');
    });

    it('should format number values correctly', () => {
      fixture.componentRef.setInput('format', 'number');
      fixture.componentRef.setInput('value', 1234.56);
      fixture.componentRef.setInput('decimals', 2);
      fixture.detectChanges();

      const valueDisplay = fixture.debugElement.query(By.css('.os-slider__value-display'));
      expect(valueDisplay.nativeElement.textContent.trim()).toBe('1.234,56');
    });
  });

  describe('tooltip functionality', () => {
    it('should show tooltip when enabled', () => {
      fixture.componentRef.setInput('showTooltip', true);
      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('decimals', 0);
      fixture.detectChanges();

      const tooltip = fixture.debugElement.query(By.css('.os-slider__tooltip'));
      expect(tooltip).toBeTruthy();
      expect(tooltip.nativeElement.textContent.trim()).toBe('50');
    });

    it('should hide tooltip when disabled', () => {
      fixture.componentRef.setInput('showTooltip', false);
      fixture.detectChanges();

      const tooltip = fixture.debugElement.query(By.css('.os-slider__tooltip'));
      expect(tooltip).toBeFalsy();
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

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      const changeEvent = new Event('change');
      Object.defineProperty(changeEvent, 'target', {
        value: { value: '75' },
        writable: false,
      });
      slider.nativeElement.dispatchEvent(changeEvent);

      expect(vibrateSpy).toHaveBeenCalledWith(50);
    });

    it('should not trigger haptic feedback when disabled', () => {
      
      Object.defineProperty(navigator, 'vibrate', {
        value: vi.fn(),
        writable: true,
      });

      fixture.componentRef.setInput('hapticFeedback', false);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      const changeEvent = new Event('change');
      Object.defineProperty(changeEvent, 'target', {
        value: { value: '75' },
        writable: false,
      });
      slider.nativeElement.dispatchEvent(changeEvent);

      expect(navigator.vibrate).not.toHaveBeenCalled();
    });
  });

  describe('focus and hover states', () => {
    it('should track focus state', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      slider.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.isFocused()).toBe(true);
    });

    it('should track blur state', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('mat-slider'));
      slider.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.isFocused()).toBe(false);
    });
  });

  describe('animation states', () => {
    it('should apply animated class when enabled', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-slider-container'));
      expect(container.nativeElement.classList.contains('os-slider-container--animated')).toBe(
        true
      );
    });

    it('should not apply animated class when disabled', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-slider-container'));
      expect(container.nativeElement.classList.contains('os-slider-container--animated')).toBe(
        false
      );
    });
  });

  describe('range change output', () => {
    it('should emit range change when min/max change', () => {
      vi.spyOn(component.rangeChange, 'emit');
      fixture.componentRef.setInput('min', 10);
      fixture.componentRef.setInput('max', 90);
      fixture.detectChanges();

      expect(component.rangeChange.emit).toHaveBeenCalledWith({ min: 10, max: 90 });
    });
  });
});
