import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsSliderComponent } from './os-slider.component';
import { vi } from 'vitest';

describe('OsSliderComponent', () => {
  let component: OsSliderComponent;
  let fixture: ComponentFixture<OsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsSliderComponent, ReactiveFormsModule],
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
      const slider = fixture.debugElement.query(By.css('.os-slider'));

      expect(label.nativeElement.textContent.trim()).toBe('Volume *');
      expect(slider.nativeElement.min).toBe('0');
      expect(slider.nativeElement.max).toBe('100');
      expect(slider.nativeElement.step).toBe('5');
      expect(slider.nativeElement.required).toBe(true);
    });

    it('should show value display when enabled', () => {
      fixture.componentRef.setInput('showValue', true);
      fixture.componentRef.setInput('value', 50);
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

      const slider = fixture.debugElement.query(By.css('.os-slider'));
      expect(slider.nativeElement.value).toBe('75');
    });

    it('should handle decimal values', () => {
      fixture.componentRef.setInput('value', 25.5);
      fixture.componentRef.setInput('step', 0.5);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('.os-slider'));
      expect(slider.nativeElement.value).toBe('25.5');
    });
  });

  describe('user interactions', () => {
    it('should emit value change on input', () => {
      vi.spyOn(component.valueChange, 'emit');
      const slider = fixture.debugElement.query(By.css('.os-slider'));

      slider.nativeElement.value = '75';
      slider.nativeElement.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).toHaveBeenCalledWith(75);
    });

    it('should emit blur event', () => {
      vi.spyOn(component.blur, 'emit');
      const slider = fixture.debugElement.query(By.css('.os-slider'));

      slider.nativeElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.blur.emit).toHaveBeenCalled();
    });

    it('should emit focus event', () => {
      vi.spyOn(component.focus, 'emit');
      const slider = fixture.debugElement.query(By.css('.os-slider'));

      slider.nativeElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.focus.emit).toHaveBeenCalled();
    });
  });

  describe('range constraints', () => {
    it('should set min value', () => {
      fixture.componentRef.setInput('min', 10);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('.os-slider'));
      expect(slider.nativeElement.min).toBe('10');
    });

    it('should set max value', () => {
      fixture.componentRef.setInput('max', 90);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('.os-slider'));
      expect(slider.nativeElement.max).toBe('90');
    });

    it('should set step value', () => {
      fixture.componentRef.setInput('step', 5);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('.os-slider'));
      expect(slider.nativeElement.step).toBe('5');
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
      const slider = fixture.debugElement.query(By.css('.os-slider'));

      expect(container.nativeElement.classList.contains('os-slider-container--error')).toBe(true);
      expect(slider.nativeElement.classList.contains('os-slider--error')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should be disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('.os-slider'));
      const container = fixture.debugElement.query(By.css('.os-slider-container'));

      expect(slider.nativeElement.disabled).toBe(true);
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
      const slider = fixture.debugElement.query(By.css('.os-slider'));

      expect(container.nativeElement.classList.contains('os-slider-container--small')).toBe(true);
      expect(slider.nativeElement.classList.contains('os-slider--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.os-slider-container'));
      const slider = fixture.debugElement.query(By.css('.os-slider'));

      expect(container.nativeElement.classList.contains('os-slider-container--large')).toBe(true);
      expect(slider.nativeElement.classList.contains('os-slider--large')).toBe(true);
    });
  });

  describe('form integration', () => {
    it('should work with reactive forms', () => {
      fixture.componentRef.setInput('value', 50);
      component.registerOnChange(() => {});
      component.registerOnTouched(() => {});

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

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('label', 'Volume');
      fixture.componentRef.setInput('helperText', 'Adjust the volume level');
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('.os-slider'));
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
      const slider = fixture.debugElement.query(By.css('.os-slider'));
      expect(slider.nativeElement.type).toBe('range');
    });

    it('should use custom aria label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom slider label');
      fixture.detectChanges();

      const slider = fixture.debugElement.query(By.css('.os-slider'));
      expect(slider.nativeElement.getAttribute('aria-label')).toBe('Custom slider label');
    });
  });

  describe('value display positioning', () => {
    it('should position value display correctly', () => {
      fixture.componentRef.setInput('showValue', true);
      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      const valueDisplay = fixture.debugElement.query(By.css('.os-slider__value-display'));
      expect(valueDisplay.nativeElement.textContent.trim()).toBe('50');
    });
  });
});
