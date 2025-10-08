import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsRadioComponent } from './os-radio.component';

describe('OsRadioComponent', () => {
  let component: OsRadioComponent;
  let fixture: ComponentFixture<OsRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsRadioComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsRadioComponent);
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

    it('should not be required by default', () => {
      expect(component.required()).toBe(false);
    });
  });

  describe('class generation', () => {
    it('should generate correct base classes', () => {
      const containerClasses = component.containerClass();
      const radioClasses = component.radioClass();

      expect(containerClasses).toContain('os-radio');
      expect(radioClasses).toContain('os-radio__circle');
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio__circle--large');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio__circle--primary');
    });

    it('should include checked class when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio__circle--checked');
    });

    it('should include disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio__circle--disabled');
    });
  });

  describe('event handling', () => {
    it('should emit radioChange when input changes', () => {
      let emittedValue: string | undefined;
      component.radioChange.subscribe((value: string) => {
        emittedValue = value;
      });

      const mockInput = document.createElement('input');
      mockInput.value = 'test-value';
      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        get: () => mockInput,
        configurable: true,
      });

      component.handleChange(event);
      expect(emittedValue).toBe('test-value');
    });

    it('should emit radioBlur when input blurs', () => {
      let emittedEvent: FocusEvent | undefined;
      component.radioBlurEvent.subscribe((event: FocusEvent) => {
        emittedEvent = event;
      });

      const event = new FocusEvent('blur');
      component.handleBlur(event);
      expect(emittedEvent).toBe(event);
    });

    it('should emit radioFocus when input focuses', () => {
      let emittedEvent: FocusEvent | undefined;
      component.radioFocusEvent.subscribe((event: FocusEvent) => {
        emittedEvent = event;
      });

      const event = new FocusEvent('focus');
      component.handleFocus(event);
      expect(emittedEvent).toBe(event);
    });
  });

  describe('accessibility', () => {
    it('should set name attribute', () => {
      fixture.componentRef.setInput('name', 'test-group');
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('name')).toBe('test-group');
    });

    it('should set value attribute', () => {
      fixture.componentRef.setInput('value', 'test-value');
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('value')).toBe('test-value');
    });

    it('should set aria-describedby attribute', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'helper-text');
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('aria-describedby')).toBe('helper-text');
    });

    it('should set aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom radio');
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.getAttribute('aria-label')).toBe('Custom radio');
    });

    it('should have unique input id', () => {
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.id).toMatch(/^os-radio-/);
    });
  });

  describe('variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'error'];

    variants.forEach((variant) => {
      it(`should apply ${variant} variant correctly`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const classes = component.radioClass();
        expect(classes).toContain(`os-radio__circle--${variant}`);
      });
    });
  });

  describe('sizes', () => {
    const sizes = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should apply ${size} size correctly`, () => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const classes = component.radioClass();
        expect(classes).toContain(`os-radio__circle--${size}`);
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
      let onChangeValue: string | undefined;

      component.registerOnChange((value: string) => {
        onChangeCalled = true;
        onChangeValue = value;
      });

      const mockInput = document.createElement('input');
      mockInput.value = 'test-value';
      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        get: () => mockInput,
        configurable: true,
      });

      component.handleChange(event);
      expect(onChangeCalled).toBe(true);
      expect(onChangeValue).toBe('test-value');
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
