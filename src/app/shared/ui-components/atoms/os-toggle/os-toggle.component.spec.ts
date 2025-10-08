import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OsToggleComponent } from './os-toggle.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';

describe('OsToggleComponent', () => {
  let component: OsToggleComponent;
  let fixture: ComponentFixture<OsToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsToggleComponent],
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
    });

    it('should render with custom label', () => {
      fixture.componentRef.setInput('label', 'Enable notifications');
      fixture.detectChanges();

      const labelElement = fixture.nativeElement.querySelector('.os-toggle__text');
      expect(labelElement.textContent.trim()).toBe('Enable notifications');
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
  });

  describe('interactions', () => {
    it('should emit toggled event when clicked', () => {
      vi.spyOn(component.toggled, 'emit');

      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.checked = true;
      inputElement.dispatchEvent(new Event('change'));

      expect(component.toggled.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit toggled event when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      vi.spyOn(component.toggled, 'emit');

      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.dispatchEvent(new Event('change'));

      expect(component.toggled.emit).not.toHaveBeenCalled();
    });

    it('should update checked state', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.checked).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have proper id and name attributes', () => {
      fixture.componentRef.setInput('id', 'test-toggle');
      fixture.componentRef.setInput('name', 'test-name');
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.id).toBe('test-toggle');
      expect(inputElement.name).toBe('test-name');
    });

    it('should have proper label association', () => {
      fixture.componentRef.setInput('id', 'test-toggle');
      fixture.detectChanges();

      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.getAttribute('for')).toBe('test-toggle');
    });

    it('should be disabled when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.disabled).toBe(true);
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
  });
});
