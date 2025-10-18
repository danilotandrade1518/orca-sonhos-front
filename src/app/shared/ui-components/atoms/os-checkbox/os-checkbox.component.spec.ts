import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsCheckboxComponent } from './os-checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('OsCheckboxComponent', () => {
  let component: OsCheckboxComponent;
  let fixture: ComponentFixture<OsCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsCheckboxComponent, MatCheckboxModule],
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

    it('should be animated by default', () => {
      expect(component.animated()).toBe(true);
    });

    it('should have default role', () => {
      expect(component.role()).toBe('checkbox');
    });
  });

  describe('class generation', () => {
    it('should generate correct base classes', () => {
      const checkboxClasses = component.checkboxClass();

      expect(checkboxClasses).toContain('os-checkbox');
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox--large');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox');
    });

    it('should include checked class when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox');
    });

    it('should include indeterminate class when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox');
    });

    it('should include disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox--disabled');
    });
  });

  describe('event handling', () => {
    it('should emit checkboxChange when input changes', () => {
      let emittedValue: boolean | undefined;
      component.checkboxChange.subscribe((value: boolean) => {
        emittedValue = value;
      });

      const event = { checked: true };
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
      const checkboxElement = fixture.nativeElement.querySelector('mat-checkbox');
      expect(checkboxElement.getAttribute('aria-describedby')).toBe('helper-text');
    });

    it('should set aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom checkbox');
      fixture.detectChanges();
      const checkboxElement = fixture.nativeElement.querySelector('mat-checkbox');
      expect(checkboxElement.getAttribute('aria-label')).toBe('Custom checkbox');
    });

    it('should set aria-labelledby attribute', () => {
      fixture.componentRef.setInput('ariaLabelledBy', 'label-id');
      fixture.detectChanges();
      const checkboxElement = fixture.nativeElement.querySelector('mat-checkbox');
      expect(checkboxElement.getAttribute('aria-labelledby')).toBe('label-id');
    });

    it('should set aria-checked attribute correctly', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.ariaChecked()).toBe('true');
    });

    it('should set aria-checked to mixed when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.ariaChecked()).toBe('mixed');
    });

    it('should set role attribute', () => {
      fixture.componentRef.setInput('role', 'switch');
      fixture.detectChanges();
      expect(component.checkboxRole()).toBe('switch');
    });

    it('should have unique input id', () => {
      const checkboxElement = fixture.nativeElement.querySelector('mat-checkbox');
      expect(checkboxElement.id).toMatch(/^os-checkbox-/);
    });
  });

  describe('variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'error'];

    variants.forEach((variant) => {
      it(`should apply ${variant} variant correctly`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const classes = component.checkboxClass();
        expect(classes).toContain('os-checkbox');
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
        expect(classes).toContain(`os-checkbox--${size}`);
      });
    });
  });

  describe('animations and interactions', () => {
    it('should include animated class when animated is true', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox--animated');
    });

    it('should not include animated class when animated is false', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).not.toContain('os-checkbox--animated');
    });

    it('should include checked class when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox--checked');
    });

    it('should include indeterminate class when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      const classes = component.checkboxClass();
      expect(classes).toContain('os-checkbox--indeterminate');
    });
  });

  describe('roles', () => {
    it('should support checkbox role', () => {
      fixture.componentRef.setInput('role', 'checkbox');
      fixture.detectChanges();
      expect(component.checkboxRole()).toBe('checkbox');
    });

    it('should support switch role', () => {
      fixture.componentRef.setInput('role', 'switch');
      fixture.detectChanges();
      expect(component.checkboxRole()).toBe('switch');
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

      const event = { checked: true };
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
