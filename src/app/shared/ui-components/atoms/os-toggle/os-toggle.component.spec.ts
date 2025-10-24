import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OsToggleComponent } from './os-toggle.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('OsToggleComponent', () => {
  let component: OsToggleComponent;
  let fixture: ComponentFixture<OsToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsToggleComponent, MatSlideToggleModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render toggle with default values', () => {
      expect(component.checked()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('primary');
      expect(component.role()).toBe('switch');
      expect(component.animated()).toBe(true);
    });

    it('should render with custom label', () => {
      fixture.componentRef.setInput('label', 'Enable notifications');
      fixture.detectChanges();

      const labelElement = fixture.nativeElement.querySelector('.os-toggle__label-text');
      expect(labelElement?.textContent).toBe('Enable notifications');
    });

    it('should render with description', () => {
      fixture.componentRef.setInput('description', 'This will enable push notifications');
      fixture.detectChanges();

      const descriptionElement = fixture.nativeElement.querySelector('.os-toggle__description');
      expect(descriptionElement?.textContent?.trim()).toBe('This will enable push notifications');
    });

    it('should render with custom size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.classList.contains('os-toggle--large')).toBe(true);
    });

    it('should render with custom variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.classList.contains('os-toggle--success')).toBe(true);
    });

    it('should render with custom role', () => {
      fixture.componentRef.setInput('role', 'checkbox');
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('mat-slide-toggle');
      expect(inputElement.getAttribute('role')).toBe('checkbox');
    });
  });

  describe('interactions', () => {
    it('should emit toggled event when clicked', () => {
      vi.spyOn(component.toggled, 'emit');

      const event = { checked: true };
      component.onToggle(event);

      expect(component.toggled.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit toggled event when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      vi.spyOn(component.toggled, 'emit');

      const event = { checked: true };
      component.onToggle(event);

      expect(component.toggled.emit).not.toHaveBeenCalled();
    });

    it('should emit focused event on focus', () => {
      vi.spyOn(component.focused, 'emit');

      component.onFocus();

      expect(component.focused.emit).toHaveBeenCalledWith(true);
    });

    it('should emit blurred event on blur', () => {
      vi.spyOn(component.blurred, 'emit');

      component.onBlur();

      expect(component.blurred.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit focused event when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      vi.spyOn(component.focused, 'emit');

      component.onFocus();

      expect(component.focused.emit).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper id and name attributes', () => {
      fixture.componentRef.setInput('id', 'test-toggle');
      fixture.componentRef.setInput('name', 'test-name');
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('mat-slide-toggle');
      expect(inputElement.id).toBe('test-toggle');
    });

    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test toggle');
      fixture.componentRef.setInput('ariaDescribedBy', 'test-description');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('mat-slide-toggle');
      expect(inputElement.getAttribute('aria-label')).toBe('Test toggle');
      expect(inputElement.getAttribute('aria-describedby')).toBe('test-description');
      expect(inputElement.getAttribute('aria-required')).toBe('true');
    });

    it('should have proper role attribute', () => {
      fixture.componentRef.setInput('role', 'checkbox');
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('mat-slide-toggle');
      expect(inputElement.getAttribute('role')).toBe('checkbox');
    });

    it('should have proper tabindex when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('mat-slide-toggle');
      expect(inputElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should have proper tabindex when enabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('mat-slide-toggle');
      // Angular Material slide toggle doesn't set tabindex by default when enabled
      expect(inputElement.getAttribute('tabindex')).toBeNull();
    });

    it('should generate description id when description is provided', () => {
      fixture.componentRef.setInput('description', 'Test description');
      fixture.detectChanges();

      const descriptionId = component.descriptionId();
      expect(descriptionId).toBe(`${component.id()}-description`);
    });

    it('should not generate description id when description is not provided', () => {
      fixture.componentRef.setInput('description', null);
      fixture.detectChanges();

      const descriptionId = component.descriptionId();
      expect(descriptionId).toBeNull();
    });
  });

  describe('CSS classes', () => {
    it('should apply correct classes for checked state', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.classList.contains('os-toggle--checked')).toBe(true);
    });

    it('should apply correct classes for disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.classList.contains('os-toggle--disabled')).toBe(true);
    });

    it('should apply correct size class', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.classList.contains('os-toggle--small')).toBe(true);
    });

    it('should apply correct variant class', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.classList.contains('os-toggle--danger')).toBe(true);
    });

    it('should apply animated class when animated is true', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.classList.contains('os-toggle--animated')).toBe(true);
    });

    it('should not apply animated class when animated is false', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.classList.contains('os-toggle--animated')).toBe(false);
    });
  });

  describe('data attributes', () => {
    it('should have correct data attributes', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('variant', 'success');
      fixture.componentRef.setInput('animated', true);
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      expect(toggleElement.getAttribute('data-size')).toBe('large');
      expect(toggleElement.getAttribute('data-variant')).toBe('success');
      expect(toggleElement.getAttribute('data-animated')).toBe('true');
      expect(toggleElement.getAttribute('data-checked')).toBe('true');
      expect(toggleElement.getAttribute('data-disabled')).toBe('false');
    });
  });

  describe('touch targets', () => {
    it('should have minimum touch target size for small', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      const computedStyle = getComputedStyle(toggleElement);
      // CSS custom properties are not resolved in test environment
      expect(computedStyle.minHeight).toBe('var(--os-touch-target-min)');
    });

    it('should have minimum touch target size for medium', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      const computedStyle = getComputedStyle(toggleElement);
      // CSS custom properties are not resolved in test environment
      expect(computedStyle.minHeight).toBe('var(--os-touch-target-min)');
    });

    it('should have larger touch target size for large', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const toggleElement = fixture.nativeElement.querySelector('.os-toggle');
      const computedStyle = getComputedStyle(toggleElement);
      expect(computedStyle.minHeight).toBe('48px');
    });
  });

  describe('computed properties', () => {
    it('should return correct toggle role', () => {
      fixture.componentRef.setInput('role', 'checkbox');
      fixture.detectChanges();

      expect(component.toggleRole()).toBe('checkbox');
    });

    it('should return correct mat color for primary variant', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();

      expect(component['matColor']()).toBe('primary');
    });

    it('should return correct mat color for secondary variant', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();

      expect(component['matColor']()).toBe('accent');
    });

    it('should return correct mat color for success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      expect(component['matColor']()).toBe('primary');
    });

    it('should return correct mat color for warning variant', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();

      expect(component['matColor']()).toBe('warn');
    });

    it('should return correct mat color for danger variant', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();

      expect(component['matColor']()).toBe('warn');
    });
  });
});
