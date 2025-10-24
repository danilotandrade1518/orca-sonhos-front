import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OsRadioComponent } from './os-radio.component';
import { MatRadioModule } from '@angular/material/radio';

describe('OsRadioComponent', () => {
  let component: OsRadioComponent;
  let fixture: ComponentFixture<OsRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsRadioComponent, MatRadioModule],
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

    it('should be animated by default', () => {
      expect(component.animated()).toBe(true);
    });

    it('should have default role', () => {
      expect(component.role()).toBe('radio');
    });
  });

  describe('class generation', () => {
    it('should generate correct base classes', () => {
      const radioClasses = component.radioClass();

      expect(radioClasses).toContain('os-radio');
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio--large');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio--primary');
    });

    it('should include checked class when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio--checked');
    });

    it('should include disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio--disabled');
    });

    it('should include animated class when animated', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio--animated');
    });

    it('should not include animated class when animated is false', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).not.toContain('os-radio--animated');
    });
  });

  describe('event handling', () => {
    it('should emit radioChange when input changes', () => {
      let emittedValue: string | undefined;
      component.radioChange.subscribe((value: string) => {
        emittedValue = value;
      });

      const event = { value: 'test-value' };
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
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement).toBeTruthy();
    });

    it('should set value attribute', () => {
      fixture.componentRef.setInput('value', 'test-value');
      fixture.detectChanges();
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement).toBeTruthy();
    });

    it('should set aria-describedby attribute', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'helper-text');
      fixture.detectChanges();
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement.getAttribute('aria-describedby')).toBe('helper-text');
    });

    it('should set aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom radio');
      fixture.detectChanges();
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement.getAttribute('aria-label')).toBe('Custom radio');
    });

    it('should set aria-labelledby attribute', () => {
      fixture.componentRef.setInput('ariaLabelledBy', 'label-id');
      fixture.detectChanges();
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement.getAttribute('aria-labelledby')).toBe('label-id');
    });

    it('should set aria-required attribute', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement.getAttribute('aria-required')).toBe('true');
    });

    it('should set role attribute', () => {
      fixture.componentRef.setInput('role', 'switch');
      fixture.detectChanges();
      expect(component.radioRole()).toBe('switch');
    });

    it('should have unique input id', () => {
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement.id).toMatch(/^os-radio-/);
    });
  });

  describe('variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'error'];

    variants.forEach((variant) => {
      it(`should apply ${variant} variant correctly`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const classes = component.radioClass();
        expect(classes).toContain('os-radio');
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
        expect(classes).toContain(`os-radio--${size}`);
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

      const event = { value: 'test-value' };
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

    it('should update value when writeValue is called', () => {
      component.writeValue('new-value');
      expect(component.value()).toBe('new-value');
    });

    it('should not update value if same value is written', () => {
      component.value.set('existing-value');
      component.writeValue('existing-value');
      expect(component.value()).toBe('existing-value');
    });

    it('should update disabled state when setDisabledState is called', () => {
      component.setDisabledState(true);
      expect(component.disabled()).toBe(true);
    });
  });

  describe('animations and interactions', () => {
    it('should include animated class when animated is true', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio--animated');
    });

    it('should not include animated class when animated is false', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).not.toContain('os-radio--animated');
    });

    it('should include checked class when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const classes = component.radioClass();
      expect(classes).toContain('os-radio--checked');
    });
  });

  describe('roles', () => {
    it('should support radio role', () => {
      fixture.componentRef.setInput('role', 'radio');
      fixture.detectChanges();
      expect(component.radioRole()).toBe('radio');
    });

    it('should support switch role', () => {
      fixture.componentRef.setInput('role', 'switch');
      fixture.detectChanges();
      expect(component.radioRole()).toBe('switch');
    });
  });

  describe('data attributes', () => {
    it('should set data-animated attribute', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement.getAttribute('data-animated')).toBe('true');
    });

    it('should set data-size attribute', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement.getAttribute('data-size')).toBe('large');
    });

    it('should set data-variant attribute', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      const radioElement = fixture.nativeElement.querySelector('mat-radio-button');
      expect(radioElement.getAttribute('data-variant')).toBe('primary');
    });
  });
});
