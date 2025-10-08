import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsLabelComponent } from './os-label.component';

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
