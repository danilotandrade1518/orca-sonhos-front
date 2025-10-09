import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ModalTemplateConfig, OsModalTemplateComponent } from './os-modal-template.component';

describe('OsModalTemplateComponent', () => {
  let component: OsModalTemplateComponent;
  let fixture: ComponentFixture<OsModalTemplateComponent>;

  const mockConfig: ModalTemplateConfig = {
    title: 'Test Modal',
    subtitle: 'Test subtitle',
    showCloseButton: true,
    showHeader: true,
    showFooter: true,
    showActions: true,
    closeButtonText: 'Fechar',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    showConfirmButton: true,
    showCancelButton: true,
    actions: [
      {
        label: 'Ação 1',
        variant: 'primary',
        size: 'medium',
        disabled: false,
        loading: false,
        icon: 'check',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsModalTemplateComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsModalTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', mockConfig);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default values', () => {
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('default');
      expect(component.theme()).toBe('light');
      expect(component.disabled()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.valid()).toBe(true);
    });

    it('should accept custom values', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('variant', 'compact');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('valid', false);

      expect(component.size()).toBe('large');
      expect(component.variant()).toBe('compact');
      expect(component.theme()).toBe('dark');
      expect(component.disabled()).toBe(true);
      expect(component.loading()).toBe(true);
      expect(component.valid()).toBe(false);
    });
  });

  describe('Computed properties', () => {
    it('should compute modal variant correctly', () => {
      fixture.componentRef.setInput('variant', 'compact');
      expect(component.modalVariant()).toBe('confirmation');

      fixture.componentRef.setInput('variant', 'default');
      expect(component.modalVariant()).toBe('default');
    });

    it('should compute content class correctly', () => {
      const contentClass = component.contentClass();
      expect(contentClass).toContain('os-modal-template__content');
      expect(contentClass).toContain('os-modal-template__content--default');
      expect(contentClass).toContain('os-modal-template__content--medium');
    });

    it('should compute actions class correctly', () => {
      const actionsClass = component.actionsClass();
      expect(actionsClass).toContain('os-modal-template__actions');
      expect(actionsClass).toContain('os-modal-template__actions--default');
      expect(actionsClass).toContain('os-modal-template__actions--medium');
    });

    it('should compute validity correctly', () => {
      expect(component.isValid()).toBe(true);

      fixture.componentRef.setInput('valid', false);
      expect(component.isValid()).toBe(false);
    });
  });

  describe('Event handling', () => {
    it('should emit close event', () => {
      vi.spyOn(component.close, 'emit');
      component.onClose();
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should emit confirm event', () => {
      vi.spyOn(component.confirm, 'emit');
      component.onConfirm();
      expect(component.confirm.emit).toHaveBeenCalled();
    });

    it('should emit cancel event', () => {
      vi.spyOn(component.cancel, 'emit');
      component.onCancel();
      expect(component.cancel.emit).toHaveBeenCalled();
    });

    it('should emit action click event', () => {
      vi.spyOn(component.actionClick, 'emit');
      const action = {
        label: 'Test Action',
        variant: 'primary' as const,
        size: 'medium' as const,
      };
      component.onActionClick(action);
      expect(component.actionClick.emit).toHaveBeenCalledWith(action);
    });

    it('should emit backdrop click event', () => {
      vi.spyOn(component.backdropClick, 'emit');
      component.onBackdropClick();
      expect(component.backdropClick.emit).toHaveBeenCalled();
    });

    it('should emit escape key event', () => {
      vi.spyOn(component.escapeKey, 'emit');
      component.onEscapeKey();
      expect(component.escapeKey.emit).toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should render with default config', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('os-modal')).toBeTruthy();
    });

    it('should render content section', () => {
      const compiled = fixture.nativeElement;
      const content = compiled.querySelector('.os-modal-template__content');
      expect(content).toBeTruthy();
    });

    it('should render actions section when showActions is true', () => {
      fixture.componentRef.setInput('config', { ...mockConfig, showActions: true });
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const actions = compiled.querySelector('.os-modal-template__actions');
      expect(actions).toBeTruthy();
    });

    it('should not render actions section when showActions is false', () => {
      fixture.componentRef.setInput('config', { ...mockConfig, showActions: false });
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const actions = compiled.querySelector('.os-modal-template__actions');
      expect(actions).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const compiled = fixture.nativeElement;
      const modal = compiled.querySelector('os-modal');
      expect(modal).toBeTruthy();
    });

    it('should handle keyboard navigation', () => {
      vi.spyOn(component.escapeKey, 'emit');
      component.onEscapeKey();
      expect(component.escapeKey.emit).toHaveBeenCalled();
    });
  });

  describe('Responsive behavior', () => {
    it('should adapt to different sizes', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const contentClass = component.contentClass();
      expect(contentClass).toContain('os-modal-template__content--small');
    });

    it('should adapt to different variants', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const contentClass = component.contentClass();
      expect(contentClass).toContain('os-modal-template__content--compact');
    });
  });

  describe('Loading and disabled states', () => {
    it('should handle loading state', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const contentClass = component.contentClass();
      expect(contentClass).toContain('os-modal-template__content--loading');
    });

    it('should handle disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const contentClass = component.contentClass();
      expect(contentClass).toContain('os-modal-template__content--disabled');
    });
  });
});
