import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { vi } from 'vitest';
import { OsDatePickerComponent, QuickDateOption } from './os-date-picker.component';

describe('OsDatePickerComponent', () => {
  let component: OsDatePickerComponent;
  let fixture: ComponentFixture<OsDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsDatePickerComponent],
      providers: [provideZonelessChangeDetection(), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDatePickerComponent);
    fixture.componentRef.setInput('value', new Date('2024-01-15'));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct default values', () => {
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('default');
      expect(component.disabled()).toBe(false);
      expect(component.required()).toBe(false);
      expect(component.touchUi()).toBe(false);
      expect(component.opened()).toBe(false);
      expect(component.calendarIcon()).toBe('calendar_today');
      expect(component.mobileFriendly()).toBe(true);
      expect(component.showQuickSelection()).toBe(false);
      expect(component.showTodayIndicator()).toBe(true);
      expect(component.isRangePicker()).toBe(false);
    });
  });

  describe('Basic Inputs', () => {
    it('should render with default placeholder', () => {
      const input = fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe('Selecionar data');
    });

    it('should render with custom placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Custom Placeholder');
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe('Custom Placeholder');
    });

    it('should render label when provided', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('mat-label');
      expect(label).toBeTruthy();
      expect(label.textContent).toBe('Test Label');
    });

    it('should render helper text when provided', () => {
      fixture.componentRef.setInput('helperText', 'Test Helper');
      fixture.detectChanges();

      const helper = fixture.nativeElement.querySelector('mat-hint');
      expect(helper).toBeTruthy();
      expect(helper.textContent.trim()).toBe('Test Helper');
    });

    it('should auto-generate helper text with format when not provided', () => {
      fixture.componentRef.setInput('helperText', '');
      fixture.detectChanges();

      expect(component.effectiveHelperText()).toBe('Formato: DD/MM/AAAA');
    });
  });

  describe('Sizes and Variants', () => {
    it('should apply size classes', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const classes = component.datePickerClasses();
      expect(classes).toContain('os-date-picker--large');
    });

    it('should apply variant classes', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.detectChanges();

      const classes = component.datePickerClasses();
      expect(classes).toContain('os-date-picker--outlined');
    });

    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const classes = component.datePickerClasses();
      expect(classes).toContain('os-date-picker--disabled');
    });

    it('should apply mobile-friendly class by default', () => {
      const classes = component.datePickerClasses();
      expect(classes).toContain('os-date-picker--mobile-friendly');
    });
  });

  describe('Date Validation', () => {
    it('should set required attribute when required is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.required).toBe(true);
    });

    it('should set disabled attribute when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.disabled).toBe(true);
    });

    it('should set min and max dates', () => {
      const minDate = new Date('2024-01-01');
      const maxDate = new Date('2024-12-31');

      fixture.componentRef.setInput('minDate', minDate);
      fixture.componentRef.setInput('maxDate', maxDate);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.min).toBeDefined();
      expect(input.max).toBeDefined();
    });
  });

  describe('Quick Date Selection', () => {
    it('should not show quick selection by default', () => {
      const quickSelection = fixture.nativeElement.querySelector(
        '.os-date-picker__quick-selection'
      );
      expect(quickSelection).toBeFalsy();
    });

    it('should show quick selection when enabled', () => {
      fixture.componentRef.setInput('showQuickSelection', true);
      fixture.detectChanges();

      const quickSelection = fixture.nativeElement.querySelector(
        '.os-date-picker__quick-selection'
      );
      expect(quickSelection).toBeTruthy();
    });

    it('should generate default quick date options', () => {
      const options = component.getDefaultQuickDateOptions();
      expect(options.length).toBe(4);
      expect(options[0].label).toBe('Hoje');
      expect(options[1].label).toBe('Amanhã');
      expect(options[2].label).toBe('Próxima Semana');
      expect(options[3].label).toBe('Próximo Mês');
    });

    it('should select quick date when button is clicked', () => {
      vi.spyOn(component.valueChange, 'emit');
      vi.spyOn(component.quickDateSelected, 'emit');

      const option: QuickDateOption = {
        label: 'Hoje',
        getValue: () => new Date('2024-01-15'),
        ariaLabel: 'Selecionar data de hoje',
      };

      component.selectQuickDate(option);

      expect(component.valueChange.emit).toHaveBeenCalled();
      expect(component.quickDateSelected.emit).toHaveBeenCalledWith(option);
    });

    it('should not select quick date when disabled', () => {
      vi.spyOn(component.valueChange, 'emit');
      fixture.componentRef.setInput('disabled', true);

      const option: QuickDateOption = {
        label: 'Hoje',
        getValue: () => new Date('2024-01-15'),
      };

      component.selectQuickDate(option);

      expect(component.valueChange.emit).not.toHaveBeenCalled();
    });

    it('should apply custom quick date options', () => {
      const customOptions: QuickDateOption[] = [
        {
          label: 'Custom Date',
          getValue: () => new Date('2024-06-15'),
        },
      ];

      component.quickDateOptions.set(customOptions);
      fixture.detectChanges();

      expect(component.quickDateOptions()).toEqual(customOptions);
    });
  });

  describe('Today Indicator', () => {
    it("should show today indicator for today's date", () => {
      const today = new Date();
      component.value.set(today);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('.os-date-picker__today-indicator');
      expect(indicator).toBeTruthy();
    });

    it('should not show today indicator for past date', () => {
      const pastDate = new Date('2020-01-01');
      component.value.set(pastDate);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('.os-date-picker__today-indicator');
      expect(indicator).toBeFalsy();
    });

    it("should correctly identify today's date", () => {
      const today = new Date();
      expect(component.isToday(today)).toBe(true);
    });

    it('should correctly identify non-today date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(component.isToday(yesterday)).toBe(false);
    });

    it('should handle null date', () => {
      expect(component.isToday(null)).toBe(false);
    });
  });

  describe('Range Picker', () => {
    it('should not show range picker by default', () => {
      const rangeSeparator = fixture.nativeElement.querySelector(
        '.os-date-picker__range-separator'
      );
      expect(rangeSeparator).toBeFalsy();
    });

    it('should show range picker when enabled', () => {
      fixture.componentRef.setInput('isRangePicker', true);
      fixture.componentRef.setInput('showRangeEnd', true);
      fixture.detectChanges();

      const rangeSeparator = fixture.nativeElement.querySelector(
        '.os-date-picker__range-separator'
      );
      expect(rangeSeparator).toBeTruthy();
    });

    it('should emit end date change', () => {
      vi.spyOn(component.endDateChange, 'emit');

      const endDate = new Date('2024-12-31');
      component.onEndDateChange(endDate);

      expect(component.endDateChange.emit).toHaveBeenCalledWith(endDate);
      expect(component.endDate()).toBe(endDate);
    });

    it('should validate range dates', () => {
      vi.spyOn(console, 'warn');

      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');

      fixture.componentRef.setInput('isRangePicker', true);
      component.value.set(startDate);
      component.endDate.set(endDate);
      fixture.detectChanges();

      expect(console.warn).toHaveBeenCalledWith('OsDatePicker: Start date is after end date');
    });

    it('should apply range picker class', () => {
      fixture.componentRef.setInput('isRangePicker', true);
      fixture.detectChanges();

      const classes = component.datePickerClasses();
      expect(classes).toContain('os-date-picker--range');
    });
  });

  describe('Events', () => {
    it('should emit valueChange when date changes', () => {
      vi.spyOn(component.valueChange, 'emit');

      const input = fixture.nativeElement.querySelector('input');
      input.value = '2024-01-15';
      input.dispatchEvent(new Event('input'));

      expect(component.valueChange.emit).toHaveBeenCalled();
    });

    it('should emit dateChange when date changes', () => {
      vi.spyOn(component.dateChange, 'emit');

      const input = fixture.nativeElement.querySelector('input');
      input.value = '2024-01-15';
      input.dispatchEvent(new Event('input'));

      expect(component.dateChange.emit).toHaveBeenCalled();
    });

    it('should emit focus and blur events', () => {
      vi.spyOn(component.focusEvent, 'emit');
      vi.spyOn(component.blurEvent, 'emit');

      const input = fixture.nativeElement.querySelector('input');

      input.dispatchEvent(new FocusEvent('focus'));
      expect(component.focusEvent.emit).toHaveBeenCalled();

      input.dispatchEvent(new FocusEvent('blur'));
      expect(component.blurEvent.emit).toHaveBeenCalled();
    });

    it('should emit end date focus and blur events', () => {
      vi.spyOn(component.endDateFocusEvent, 'emit');
      vi.spyOn(component.endDateBlurEvent, 'emit');

      const focusEvent = new FocusEvent('focus');
      const blurEvent = new FocusEvent('blur');

      component.onEndDateFocus(focusEvent);
      expect(component.endDateFocusEvent.emit).toHaveBeenCalledWith(focusEvent);

      component.onEndDateBlur(blurEvent);
      expect(component.endDateBlurEvent.emit).toHaveBeenCalledWith(blurEvent);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement ControlValueAccessor', () => {
      expect(component.writeValue).toBeDefined();
      expect(component.registerOnChange).toBeDefined();
      expect(component.registerOnTouched).toBeDefined();
      expect(component.setDisabledState).toBeDefined();
    });

    it('should call onChange when value changes', () => {
      let onChangeCalled = false;
      component.registerOnChange(() => {
        onChangeCalled = true;
      });

      const input = fixture.nativeElement.querySelector('input');
      input.value = '2024-01-15';
      input.dispatchEvent(new Event('input'));

      expect(onChangeCalled).toBe(true);
    });

    it('should call onTouched when input is blurred', () => {
      let onTouchedCalled = false;
      component.registerOnTouched(() => {
        onTouchedCalled = true;
      });

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new FocusEvent('blur'));

      expect(onTouchedCalled).toBe(true);
    });

    it('should write value correctly', () => {
      const newDate = new Date('2024-06-15');
      component.writeValue(newDate);

      expect(component.value()).toEqual(newDate);
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled()).toBe(true);

      component.setDisabledState(false);
      expect(component.disabled()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA role', () => {
      fixture.componentRef.setInput('role', 'dialog');
      fixture.detectChanges();

      const datePicker = fixture.nativeElement.querySelector('.os-date-picker');
      expect(datePicker.getAttribute('role')).toBe('dialog');
    });

    it('should have ARIA label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Select birth date');
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-label')).toBe('Select birth date');
    });

    it('should have ARIA described by when provided', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'date-helper');
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-describedby')).toContain('date-helper');
    });

    it('should have today indicator with role status', () => {
      const today = new Date();
      component.value.set(today);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('.os-date-picker__today-indicator');
      expect(indicator).toBeTruthy();
      expect(indicator.getAttribute('role')).toBe('status');
      expect(indicator.getAttribute('aria-live')).toBe('polite');
    });

    it('should have quick selection group with ARIA label', () => {
      fixture.componentRef.setInput('showQuickSelection', true);
      fixture.detectChanges();

      const group = fixture.nativeElement.querySelector('.os-date-picker__quick-selection');
      expect(group).toBeTruthy();
      expect(group.getAttribute('role')).toBe('group');
      expect(group.getAttribute('aria-label')).toBe('Seleção rápida de data');
    });
  });

  describe('Mobile-Friendly', () => {
    it('should apply mobile-friendly class by default', () => {
      const classes = component.datePickerClasses();
      expect(classes).toContain('os-date-picker--mobile-friendly');
    });

    it('should not apply mobile-friendly class when disabled', () => {
      fixture.componentRef.setInput('mobileFriendly', false);
      fixture.detectChanges();

      const classes = component.datePickerClasses();
      expect(classes).not.toContain('os-date-picker--mobile-friendly');
    });

    it('should have data attribute for mobile-friendly', () => {
      const host = fixture.nativeElement;
      expect(host.getAttribute('data-mobile-friendly')).toBe('true');
    });
  });

  describe('Computed Properties', () => {
    it('should compute date picker classes correctly', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('showQuickSelection', true);
      fixture.detectChanges();

      const classes = component.datePickerClasses();
      expect(classes).toContain('os-date-picker');
      expect(classes).toContain('os-date-picker--large');
      expect(classes).toContain('os-date-picker--outlined');
      expect(classes).toContain('os-date-picker--disabled');
      expect(classes).toContain('os-date-picker--with-quick-selection');
    });

    it('should compute effective helper text with format', () => {
      fixture.componentRef.setInput('helperText', '');
      fixture.detectChanges();

      expect(component.effectiveHelperText()).toBe('Formato: DD/MM/AAAA');
    });

    it('should use provided helper text when available', () => {
      fixture.componentRef.setInput('helperText', 'Custom helper text');
      fixture.detectChanges();

      expect(component.effectiveHelperText()).toBe('Custom helper text');
    });
  });

  describe('Internal Methods', () => {
    it('should map size correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      expect(component.getInputSize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium');
      expect(component.getInputSize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large');
      expect(component.getInputSize()).toBe('large');
    });

    it('should return correct date format', () => {
      expect(component.getDateFormat()).toBe('DD/MM/AAAA');
    });
  });
});
