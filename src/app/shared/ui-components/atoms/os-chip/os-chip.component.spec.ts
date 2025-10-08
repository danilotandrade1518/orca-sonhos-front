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

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      removeButton.click();

      expect(component.removed.emit).toHaveBeenCalled();
    });

    it('should not emit removed event when disabled', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      vi.spyOn(component.removed, 'emit');

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      removeButton.click();

      expect(component.removed.emit).not.toHaveBeenCalled();
    });

    it('should stop propagation when remove button is clicked', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      vi.spyOn(component.clicked, 'emit');
      vi.spyOn(component.removed, 'emit');

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      removeButton.click();

      expect(component.removed.emit).toHaveBeenCalled();
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('removable functionality', () => {
    it('should show remove button when removable is true', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      expect(removeButton).toBeTruthy();
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

      const removeButton = fixture.nativeElement.querySelector('.os-chip__remove');
      expect(removeButton.getAttribute('aria-label')).toBe('Remove tag');
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
  });
});
