import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { OsAlertComponent } from './os-alert.component';

describe('OsAlertComponent', () => {
  let component: OsAlertComponent;
  let fixture: ComponentFixture<OsAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsAlertComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Type', () => {
    it('should apply info type by default', () => {
      expect(component.type()).toBe('info');
    });

    it('should apply success type', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--success')).toBe(true);
    });

    it('should apply warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--warning')).toBe(true);
    });

    it('should apply error type', () => {
      fixture.componentRef.setInput('type', 'error');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--error')).toBe(true);
    });

    it('should apply info type', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--info')).toBe(false);
    });
  });

  describe('Size', () => {
    it('should apply medium size by default', () => {
      expect(component.size()).toBe('medium');
    });

    it('should apply small size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--small')).toBe(true);
    });

    it('should apply large size', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--large')).toBe(true);
    });
  });

  describe('Title', () => {
    it('should not show title by default', () => {
      const titleElement = fixture.nativeElement.querySelector('.os-alert__title');
      expect(titleElement).toBeFalsy();
    });

    it('should show title when provided', () => {
      fixture.componentRef.setInput('title', 'Alert Title');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.os-alert__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent).toBe('Alert Title');
    });
  });

  describe('Dismissible', () => {
    it('should not be dismissible by default', () => {
      expect(component.dismissible()).toBe(false);
    });

    it('should be dismissible when enabled', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--dismissible')).toBe(true);
    });

    it('should show dismiss button when dismissible', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissButton = fixture.nativeElement.querySelector('os-button');
      expect(dismissButton).toBeTruthy();
    });

    it('should emit dismiss event when dismiss button is clicked', () => {
      vi.useFakeTimers();
      const emitSpy = vi.spyOn(component.dismiss, 'emit');
      fixture.componentRef.setInput('dismissible', true);
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();

      component.onDismiss();

      vi.advanceTimersByTime(1);

      expect(emitSpy).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('Icon', () => {
    it('should show icon by default', () => {
      expect(component.showIcon()).toBe(true);
    });

    it('should not show icon when disabled', () => {
      fixture.componentRef.setInput('showIcon', false);
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('.os-alert__icon');
      expect(iconElement).toBeFalsy();
    });

    it('should show correct icon for success type', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();

      expect(component['iconName']()).toBe('check_circle');
    });

    it('should show correct icon for warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();

      expect(component['iconName']()).toBe('warning');
    });

    it('should show correct icon for error type', () => {
      fixture.componentRef.setInput('type', 'error');
      fixture.detectChanges();

      expect(component['iconName']()).toBe('error');
    });

    it('should show correct icon for info type', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.detectChanges();

      expect(component['iconName']()).toBe('info');
    });
  });

  describe('Icon Size', () => {
    it('should apply correct icon class for size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('os-icon');
      expect(iconElement).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes with default role', () => {
      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.getAttribute('role')).toBe('alert');
      expect(alertElement.getAttribute('aria-live')).toBe('assertive');
    });

    it('should have proper dismiss button accessibility', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissButton = fixture.nativeElement.querySelector('os-button');
      expect(dismissButton.getAttribute('aria-label')).toBe('Fechar alerta');
    });

    it('should support custom role', () => {
      fixture.componentRef.setInput('role', 'status');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.getAttribute('role')).toBe('status');
      expect(alertElement.getAttribute('aria-live')).toBe('polite');
    });

    it('should support custom aria-label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom alert message');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.getAttribute('aria-label')).toBe('Custom alert message');
    });

    it('should have default aria-label based on type', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();

      expect(component['effectiveAriaLabel']()).toBe('Mensagem de sucesso');
    });
  });

  describe('Content Projection', () => {
    it('should project content into message area', () => {
      fixture.detectChanges();

      const messageElement = fixture.nativeElement.querySelector('.os-alert__message');
      expect(messageElement).toBeTruthy();
    });
  });

  describe('Template Rendering', () => {
    it('should render all elements when fully configured', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('title', 'Success Alert');
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      const iconElement = fixture.nativeElement.querySelector('os-icon');
      const titleElement = fixture.nativeElement.querySelector('.os-alert__title');
      const messageElement = fixture.nativeElement.querySelector('.os-alert__message');
      const dismissButton = fixture.nativeElement.querySelector('os-button');

      expect(alertElement).toBeTruthy();
      expect(iconElement).toBeTruthy();
      expect(titleElement).toBeTruthy();
      expect(messageElement).toBeTruthy();
      expect(dismissButton).toBeTruthy();
    });
  });

  describe('Auto Dismiss', () => {
    it('should not auto-dismiss by default', () => {
      expect(component.autoDismiss()).toBe(false);
    });

    it('should auto-dismiss when enabled', () => {
      vi.useFakeTimers();
      const dismissSpy = vi.spyOn(component.dismiss, 'emit');
      fixture.componentRef.setInput('autoDismiss', true);
      fixture.componentRef.setInput('autoDismissDelay', 100);
      fixture.detectChanges();

      expect(component.visible()).toBe(true);

      vi.advanceTimersByTime(101);

      expect(component.visible()).toBe(false);

      // Aguardar o setTimeout interno do onDismiss (300ms para animação)
      vi.advanceTimersByTime(300);
      expect(dismissSpy).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('Animations', () => {
    it('should be animated by default', () => {
      expect(component.animated()).toBe(true);
    });

    it('should apply animated class when animated', () => {
      fixture.detectChanges();
      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--animated')).toBe(true);
    });

    it('should not apply animated class when not animated', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();
      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.classList.contains('os-alert--animated')).toBe(false);
    });
  });

  describe('Visibility', () => {
    it('should be visible by default', () => {
      expect(component.visible()).toBe(true);
    });

    it('should hide when dismissed', () => {
      vi.useFakeTimers();
      fixture.componentRef.setInput('dismissible', true);
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();

      component.onDismiss();

      expect(component.visible()).toBe(false);

      vi.advanceTimersByTime(1);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement).toBeFalsy();

      vi.useRealTimers();
    });
  });

  describe('Data Attributes', () => {
    it('should set data-type attribute', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.getAttribute('data-type')).toBe('warning');
    });

    it('should set data-size attribute', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.getAttribute('data-size')).toBe('large');
    });

    it('should set data-role attribute', () => {
      fixture.componentRef.setInput('role', 'status');
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.getAttribute('data-role')).toBe('status');
    });

    it('should set data-animated attribute', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.getAttribute('data-animated')).toBe('false');
    });
  });
});
