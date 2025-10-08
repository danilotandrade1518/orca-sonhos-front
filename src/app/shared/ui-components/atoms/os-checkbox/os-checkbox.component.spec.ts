import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsCheckboxComponent } from './os-checkbox.component';

describe('OsCheckboxComponent', () => {
  let component: OsCheckboxComponent;
  let fixture: ComponentFixture<OsCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsCheckboxComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default properties', () => {
    it('should have default size', () => {
      expect(component.size()).toBe('medium');
    });

    it('should have default variant', () => {
      expect(component.variant()).toBe('default');
    });

    it('should not be checked by default', () => {
      expect(component.checked()).toBe(false);
    });

    it('should not be disabled by default', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should not be indeterminate by default', () => {
      expect(component.indeterminate()).toBe(false);
    });

    it('should not be required by default', () => {
      expect(component.required()).toBe(false);
    });
  });

  describe('class generation', () => {
    it('should generate correct base classes', () => {
      const containerClasses = component.containerClass();
      const checkboxClasses = component.checkboxClass();

      expect(containerClasses).toContain('os-checkbox');
      expect(checkboxClasses).toContain('os-checkbox__box');
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox__box--large');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox__box--primary');
    });

    it('should include checked class when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox__box--checked');
    });

    it('should include indeterminate class when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox__box--indeterminate');
    });

    it('should include disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox__box--disabled');
    });
  });

  describe('event handling', () => {
    it('should emit checkboxChange when input changes', () => {
      let emittedValue: boolean | undefined;
      component.checkboxChange.subscribe((value: boolean) => {
        emittedValue = value;
      });

      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: true },
        writable: false,
      });

      component.handleChange(event);
      expect(emittedValue).toBe(true);
    });

    it('should emit checkboxBlur when input blurs', () => {
      let emittedEvent: FocusEvent | undefined;
      component.checkboxBlurEvent.subscribe((event: FocusEvent) => {
        emittedEvent = event;
      });

      const event = new FocusEvent('blur');
      component.handleBlur(event);
      expect(emittedEvent).toBe(event);
    });

    it('should emit checkboxFocus when input focuses', () => {
      let emittedEvent: FocusEvent | undefined;
      component.checkboxFocusEvent.subscribe((event: FocusEvent) => {
        emittedEvent = event;
      });

      const event = new FocusEvent('focus');
      component.handleFocus(event);
      expect(emittedEvent).toBe(event);
    });
  });

  describe('accessibility', () => {
    it('should set aria-describedby attribute', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'helper-text');
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('aria-describedby')).toBe('helper-text');
    });

    it('should set aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom checkbox');
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('aria-label')).toBe('Custom checkbox');
    });

    it('should have unique input id', () => {
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.id).toMatch(/^os-checkbox-/);
    });
  });

  describe('variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'error'];

    variants.forEach((variant) => {
      it(`should apply ${variant} variant correctly`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const classes = component.checkboxClass();
        expect(classes).toContain(`os-checkbox__box--${variant}`);
      });
    });
  });

  describe('sizes', () => {
    const sizes = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should apply ${size} size correctly`, () => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const classes = component.checkboxClass();
        expect(classes).toContain(`os-checkbox__box--${size}`);
      });
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement ControlValueAccessor interface', () => {
      expect(component.writeValue).toBeDefined();
      expect(component.registerOnChange).toBeDefined();
      expect(component.registerOnTouched).toBeDefined();
      expect(component.setDisabledState).toBeDefined();
    });

    it('should call onChange when value changes', () => {
      let onChangeCalled = false;
      let onChangeValue: boolean | undefined;

      component.registerOnChange((value: boolean) => {
        onChangeCalled = true;
        onChangeValue = value;
      });

      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: true },
        writable: false,
      });

      component.handleChange(event);
      expect(onChangeCalled).toBe(true);
      expect(onChangeValue).toBe(true);
    });

    it('should call onTouched when input blurs', () => {
      let onTouchedCalled = false;

      component.registerOnTouched(() => {
        onTouchedCalled = true;
      });

      const event = new FocusEvent('blur');
      component.handleBlur(event);
      expect(onTouchedCalled).toBe(true);
    });
  });
});
