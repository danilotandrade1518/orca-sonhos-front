import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { OsDropdownComponent, OsDropdownOption } from './os-dropdown.component';

describe('OsDropdownComponent', () => {
  let component: OsDropdownComponent;
  let fixture: ComponentFixture<OsDropdownComponent>;

  const mockOptions: OsDropdownOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2', disabled: true },
    { value: 'option3', label: 'Option 3', icon: 'star' },
    { value: 'divider', label: '', divider: true },
    { value: 'option4', label: 'Option 4' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsDropdownComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render trigger button', () => {
      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger).toBeTruthy();
    });

    it('should render with options', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      // O menu só é renderizado quando aberto, então verificamos se o trigger existe
      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger).toBeTruthy();
    });

    it('should render with icon when provided', () => {
      fixture.componentRef.setInput('icon', 'home');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('os-icon');
      expect(icon).toBeTruthy();
      // The os-icon component should be present when icon is provided
      expect(icon).toBeDefined();
    });

    it('should render with chevron by default', () => {
      const chevronIcons = fixture.nativeElement.querySelectorAll('os-icon');
      // Should have at least one os-icon (the chevron)
      expect(chevronIcons.length).toBeGreaterThan(0);
    });

    it('should not render chevron when showChevron is false', () => {
      fixture.componentRef.setInput('showChevron', false);
      fixture.detectChanges();

      const chevron = fixture.nativeElement.querySelector('.os-dropdown__chevron');
      expect(chevron).toBeFalsy();
    });

    it('should render placeholder when no value selected', () => {
      fixture.componentRef.setInput('placeholder', 'Select an option');
      fixture.detectChanges();

      const text = fixture.nativeElement.querySelector('.os-dropdown__text');
      expect(text.textContent.trim()).toBe('Select an option');
    });
  });

  describe('variants', () => {
    it('should apply default variant classes', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--default')).toBeFalsy();
    });

    it('should apply primary variant classes', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--primary')).toBeTruthy();
    });

    it('should apply secondary variant classes', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--secondary')).toBeTruthy();
    });

    it('should apply accent variant classes', () => {
      fixture.componentRef.setInput('variant', 'accent');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--accent')).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('should apply small size classes', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--small')).toBeTruthy();
    });

    it('should apply medium size classes', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      // Para medium, não há classe específica (é o padrão)
      expect(container.classList.contains('os-dropdown')).toBeTruthy();
      expect(container.classList.contains('os-dropdown--medium')).toBeFalsy();
    });

    it('should apply large size classes', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--large')).toBeTruthy();
    });
  });

  describe('states', () => {
    it('should apply disabled state classes', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--disabled')).toBeTruthy();
    });

    it('should disable trigger when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.disabled).toBe(true);
    });
  });

  describe('interactions', () => {
    it('should emit menuOpen when trigger is clicked', () => {
      const menuOpenSpy = vi.fn();
      component.menuOpen.subscribe(menuOpenSpy);

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.click();

      expect(menuOpenSpy).toHaveBeenCalled();
    });

    it('should not emit menuOpen when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const menuOpenSpy = vi.fn();
      component.menuOpen.subscribe(menuOpenSpy);

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.click();

      expect(menuOpenSpy).not.toHaveBeenCalled();
    });
  });

  describe('computed properties', () => {
    it('should compute selectedLabel correctly', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.componentRef.setInput('selectedValue', 'option1');
      fixture.detectChanges();

      expect(component.selectedLabel()).toBe('Option 1');
    });

    it('should return placeholder when no value selected', () => {
      fixture.componentRef.setInput('placeholder', 'Select option');
      fixture.componentRef.setInput('selectedValue', null);
      fixture.detectChanges();

      expect(component.selectedLabel()).toBe('Select option');
    });

    it('should compute container class correctly', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.os-dropdown');
      expect(container.classList.contains('os-dropdown--primary')).toBeTruthy();
      expect(container.classList.contains('os-dropdown--large')).toBeTruthy();
      expect(container.classList.contains('os-dropdown--disabled')).toBeTruthy();
    });

    it('should compute xPosition correctly', () => {
      fixture.componentRef.setInput('alignment', 'start');
      expect(component.xPosition()).toBe('before');

      fixture.componentRef.setInput('alignment', 'end');
      expect(component.xPosition()).toBe('after');

      fixture.componentRef.setInput('alignment', 'center');
      expect(component.xPosition()).toBe('after');
    });

    it('should compute yPosition correctly', () => {
      expect(component.yPosition()).toBe('below');
    });
  });

  describe('option handling', () => {
    it('should handle option click', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      const valueChangeSpy = vi.fn();
      const optionSelectSpy = vi.fn();
      component.valueChange.subscribe(valueChangeSpy);
      component.optionSelect.subscribe(optionSelectSpy);

      component.handleOptionClick(mockOptions[0]);

      expect(valueChangeSpy).toHaveBeenCalledWith('option1');
      expect(optionSelectSpy).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('should not handle disabled option click', () => {
      fixture.componentRef.setInput('options', mockOptions);
      fixture.detectChanges();

      const valueChangeSpy = vi.fn();
      component.valueChange.subscribe(valueChangeSpy);

      component.handleOptionClick(mockOptions[1]);

      expect(valueChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom dropdown');
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.getAttribute('aria-label')).toBe('Custom dropdown');
    });

    it('should set aria-expanded correctly', () => {
      expect(component.isOpen()).toBe(false);

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-haspopup correctly', () => {
      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    });
  });
});
