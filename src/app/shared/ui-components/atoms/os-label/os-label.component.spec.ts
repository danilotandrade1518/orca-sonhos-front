import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsLabelComponent } from './os-label.component';
import { vi } from 'vitest';

describe('OsLabelComponent', () => {
  let component: OsLabelComponent;
  let fixture: ComponentFixture<OsLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsLabelComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default properties', () => {
    it('should have default variant', () => {
      expect(component.variant()).toBe('default');
    });

    it('should have default size', () => {
      expect(component.size()).toBe('medium');
    });

    it('should have default weight', () => {
      expect(component.weight()).toBe('regular');
    });

    it('should not be required by default', () => {
      expect(component.required()).toBe(false);
    });

    it('should not be disabled by default', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should have default animated state', () => {
      expect(component.animated()).toBe(true);
    });

    it('should have default haptic feedback state', () => {
      expect(component.hapticFeedback()).toBe(true);
    });
  });

  describe('class generation', () => {
    it('should generate correct base class', () => {
      const classes = component.labelClass();
      expect(classes).toContain('os-label');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      const classes = component.labelClass();
      expect(classes).toContain('os-label--primary');
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      const classes = component.labelClass();
      expect(classes).toContain('os-label--large');
    });

    it('should include weight class', () => {
      fixture.componentRef.setInput('weight', 'bold');
      fixture.detectChanges();
      const classes = component.labelClass();
      expect(classes).toContain('os-label--bold');
    });

    it('should include required class when required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const classes = component.labelClass();
      expect(classes).toContain('os-label--required');
    });

    it('should include disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const classes = component.labelClass();
      expect(classes).toContain('os-label--disabled');
    });

    it('should include focused class when focused', () => {
      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.dispatchEvent(new FocusEvent('focus'));
      const classes = component.labelClass();
      expect(classes).toContain('os-label--focused');
    });

    it('should include hovered class when hovered', () => {
      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.dispatchEvent(new MouseEvent('mouseenter'));
      const classes = component.labelClass();
      expect(classes).toContain('os-label--hovered');
    });

    it('should include animated class when animated', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();
      const classes = component.labelClass();
      expect(classes).toContain('os-label--animated');
    });
  });

  describe('accessibility', () => {
    it('should set for attribute', () => {
      fixture.componentRef.setInput('for', 'test-input');
      fixture.detectChanges();
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.getAttribute('for')).toBe('test-input');
    });

    it('should set aria-describedby attribute', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'helper-text');
      fixture.detectChanges();
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.getAttribute('aria-describedby')).toBe('helper-text');
    });

    it('should set aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.detectChanges();
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.getAttribute('aria-label')).toBe('Custom label');
    });

    it('should set aria-required attribute', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.getAttribute('aria-required')).toBe('true');
    });

    it('should set aria-disabled attribute', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set tabindex for disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should set tabindex for enabled state', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('haptic feedback', () => {
    it('should trigger haptic feedback on click', () => {
      // Mock navigator.vibrate
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: vibrateSpy,
        writable: true,
      });

      fixture.componentRef.setInput('hapticFeedback', true);
      fixture.detectChanges();

      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.click();

      expect(vibrateSpy).toHaveBeenCalledWith(50);
    });

    it('should not trigger haptic feedback when disabled', () => {
      // Mock navigator.vibrate
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: vibrateSpy,
        writable: true,
      });

      fixture.componentRef.setInput('hapticFeedback', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.click();

      expect(vibrateSpy).not.toHaveBeenCalled();
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

      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.click();

      expect(vibrateSpy).not.toHaveBeenCalled();
    });
  });

  describe('interactions', () => {
    it('should track focus state', () => {
      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.isFocused()).toBe(true);
    });

    it('should track blur state', () => {
      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.dispatchEvent(new FocusEvent('blur'));

      expect(component.isFocused()).toBe(false);
    });

    it('should track hover state', () => {
      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.dispatchEvent(new MouseEvent('mouseenter'));

      expect(component.isHovered()).toBe(true);
    });

    it('should track mouse leave state', () => {
      const labelElement = fixture.nativeElement.querySelector('label');
      labelElement.dispatchEvent(new MouseEvent('mouseleave'));

      expect(component.isHovered()).toBe(false);
    });
  });

  describe('variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'];

    variants.forEach((variant) => {
      it(`should apply ${variant} variant correctly`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const classes = component.labelClass();
        expect(classes).toContain(`os-label--${variant}`);
      });
    });
  });

  describe('sizes', () => {
    const sizes = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should apply ${size} size correctly`, () => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const classes = component.labelClass();
        expect(classes).toContain(`os-label--${size}`);
      });
    });
  });

  describe('weights', () => {
    const weights = ['light', 'regular', 'medium', 'semibold', 'bold'];

    weights.forEach((weight) => {
      it(`should apply ${weight} weight correctly`, () => {
        fixture.componentRef.setInput('weight', weight);
        fixture.detectChanges();
        const classes = component.labelClass();
        expect(classes).toContain(`os-label--${weight}`);
      });
    });
  });
});
