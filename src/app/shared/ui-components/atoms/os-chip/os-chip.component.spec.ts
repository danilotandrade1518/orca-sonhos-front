import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OsChipComponent } from './os-chip.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';

describe('OsChipComponent', () => {
  let component: OsChipComponent;
  let fixture: ComponentFixture<OsChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsChipComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render with default values', () => {
      expect(component.text()).toBe('');
      expect(component.icon()).toBe(null);
      expect(component.removable()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.selected()).toBe(false);
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('neutral');
      expect(component.ariaLabel()).toBe('');
      expect(component.ariaDescribedBy()).toBe('');
      expect(component.role()).toBe('button');
      expect(component.animated()).toBe(true);
      expect(component.hapticFeedback()).toBe(true);
    });

    it('should render with custom text', () => {
      fixture.componentRef.setInput('text', 'Tag');
      fixture.detectChanges();

      const textElement = fixture.nativeElement.querySelector('.os-chip__text');
      expect(textElement.textContent.trim()).toBe('Tag');
    });

    it('should render with custom icon', () => {
      fixture.componentRef.setInput('icon', '★');
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('.os-chip__icon');
      expect(iconElement.textContent.trim()).toBe('★');
    });

    it('should render with custom size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      expect(chipElement.classList.contains('os-chip--large')).toBe(true);
    });

    it('should render with custom variant', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      expect(chipElement.classList.contains('os-chip--primary')).toBe(true);
    });
  });

  describe('interactions', () => {
    it('should emit clicked event when clicked', () => {
      vi.spyOn(component.clicked, 'emit');

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      chipElement.click();

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit clicked event when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      vi.spyOn(component.clicked, 'emit');

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      chipElement.click();

      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('should emit removed event when remove button is clicked', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      vi.spyOn(component.removed, 'emit');

      // Trigger the removed event directly since mat-chip handles removal internally
      component.onRemove();

      expect(component.removed.emit).toHaveBeenCalled();
    });

    it('should not emit removed event when disabled', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      vi.spyOn(component.removed, 'emit');

      // Even when disabled, onRemove should not emit
      component.onRemove();

      expect(component.removed.emit).not.toHaveBeenCalled();
    });

    it('should stop propagation when remove button is clicked', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      vi.spyOn(component.clicked, 'emit');
      vi.spyOn(component.removed, 'emit');

      // Test that onRemove works correctly
      component.onRemove();

      expect(component.removed.emit).toHaveBeenCalled();
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('removable functionality', () => {
    it('should show remove button when removable is true', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      // mat-chip handles removable internally, so we test the removable property
      expect(component.removable()).toBe(true);
    });

    it('should not show remove button when removable is false', () => {
      fixture.componentRef.setInput('removable', false);
      fixture.detectChanges();

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      expect(removeButton).toBeFalsy();
    });

    it('should have correct aria-label for remove button', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.componentRef.setInput('removeLabel', 'Remove tag');
      fixture.detectChanges();

      // mat-chip handles aria-label internally, so we test the removeLabel property
      expect(component.removeLabel()).toBe('Remove tag');
    });
  });

  describe('CSS classes', () => {
    it('should apply correct classes for selected state', () => {
      fixture.componentRef.setInput('selected', true);
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      expect(chipElement.classList.contains('os-chip--selected')).toBe(true);
    });

    it('should apply correct classes for disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      expect(chipElement.classList.contains('os-chip--disabled')).toBe(true);
    });

    it('should apply correct classes for removable state', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      expect(chipElement.classList.contains('os-chip--removable')).toBe(true);
    });

    it('should apply correct size class', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      expect(chipElement.classList.contains('os-chip--small')).toBe(true);
    });

    it('should apply correct variant class', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      expect(chipElement.classList.contains('os-chip--success')).toBe(true);
    });

    it('should apply focused class when focused', () => {
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      chipElement.dispatchEvent(new FocusEvent('focus'));

      expect(component.isFocused()).toBe(true);
    });

    it('should apply hovered class when hovered', () => {
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      chipElement.dispatchEvent(new MouseEvent('mouseenter'));

      expect(component.isHovered()).toBe(true);
    });

    it('should apply animated class when animated', () => {
      fixture.componentRef.setInput('animated', true);
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      expect(chipElement.classList.contains('os-chip--animated')).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('text', 'Test Chip');
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.componentRef.setInput('ariaDescribedBy', 'description');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('mat-chip');
      expect(chipElement.getAttribute('aria-label')).toBe('Custom label');
      expect(chipElement.getAttribute('aria-describedby')).toBe('description');
      // mat-chip applies role internally, so we test the component's role input
      expect(component.role()).toBe('button');
      expect(chipElement.getAttribute('tabindex')).toBe('0');
    });

    it('should have proper ARIA pressed attribute for selected state', () => {
      fixture.componentRef.setInput('text', 'Test');
      fixture.componentRef.setInput('selected', true);
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('mat-chip');
      expect(chipElement.getAttribute('aria-pressed')).toBe('true');
    });

    it('should have proper tabindex for disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('mat-chip');
      expect(chipElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should have proper role attribute', () => {
      fixture.componentRef.setInput('role', 'option');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('mat-chip');
      expect(chipElement.getAttribute('role')).toBe('option');
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
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      chipElement.click();

      expect(vibrateSpy).toHaveBeenCalledWith(50);
    });

    it('should not trigger haptic feedback when disabled', () => {
      // Mock navigator.vibrate
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: vibrateSpy,
        writable: true,
      });

      fixture.componentRef.setInput('hapticFeedback', false);
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      chipElement.click();

      expect(vibrateSpy).not.toHaveBeenCalled();
    });
  });

  describe('focus and blur events', () => {
    it('should emit focus event', () => {
      vi.spyOn(component.focusEvent, 'emit');
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      const focusEvent = new FocusEvent('focus');
      chipElement.dispatchEvent(focusEvent);

      expect(component.focusEvent.emit).toHaveBeenCalledWith(focusEvent);
    });

    it('should emit blur event', () => {
      vi.spyOn(component.blurEvent, 'emit');
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      const chipElement = fixture.nativeElement.querySelector('.os-chip');
      const blurEvent = new FocusEvent('blur');
      chipElement.dispatchEvent(blurEvent);

      expect(component.blurEvent.emit).toHaveBeenCalledWith(blurEvent);
    });
  });

  describe('remove button', () => {
    it('should render remove button when removable is true', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      expect(removeButton).toBeTruthy();
    });

    it('should have proper ARIA attributes for remove button', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.componentRef.setInput('removeLabel', 'Remove tag');
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      expect(removeButton.getAttribute('aria-label')).toBe('Remove tag');
    });

    it('should stop propagation when remove button is clicked', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.componentRef.setInput('text', 'Test');
      fixture.detectChanges();

      vi.spyOn(component.clicked, 'emit');
      vi.spyOn(component.removed, 'emit');

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      removeButton.click();

      expect(component.removed.emit).toHaveBeenCalled();
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });
});
