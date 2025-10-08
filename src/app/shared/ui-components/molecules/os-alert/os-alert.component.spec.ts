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

      const dismissButton = fixture.nativeElement.querySelector('.os-alert__dismiss');
      expect(dismissButton).toBeTruthy();
    });

    it('should emit dismiss event when dismiss button is clicked', () => {
      const emitSpy = vi.spyOn(component.dismiss, 'emit');
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissButton = fixture.nativeElement.querySelector('.os-alert__dismiss');
      dismissButton.click();

      expect(emitSpy).toHaveBeenCalled();
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

      expect(component.iconName()).toBe('check-circle');
    });

    it('should show correct icon for warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();

      expect(component.iconName()).toBe('warning');
    });

    it('should show correct icon for error type', () => {
      fixture.componentRef.setInput('type', 'error');
      fixture.detectChanges();

      expect(component.iconName()).toBe('error');
    });

    it('should show correct icon for info type', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.detectChanges();

      expect(component.iconName()).toBe('info');
    });
  });

  describe('Icon Size', () => {
    it('should map size correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      expect(component.iconSize()).toBe('sm');

      fixture.componentRef.setInput('size', 'medium');
      expect(component.iconSize()).toBe('md');

      fixture.componentRef.setInput('size', 'large');
      expect(component.iconSize()).toBe('lg');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const alertElement = fixture.nativeElement.querySelector('.os-alert');
      expect(alertElement.getAttribute('role')).toBe('alert');
      expect(alertElement.getAttribute('aria-live')).toBe('polite');
    });

    it('should have proper dismiss button accessibility', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissButton = fixture.nativeElement.querySelector('.os-alert__dismiss');
      expect(dismissButton.getAttribute('aria-label')).toBe('Fechar alerta');
      expect(dismissButton.getAttribute('type')).toBe('button');
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
      const iconElement = fixture.nativeElement.querySelector('.os-alert__icon');
      const titleElement = fixture.nativeElement.querySelector('.os-alert__title');
      const messageElement = fixture.nativeElement.querySelector('.os-alert__message');
      const dismissButton = fixture.nativeElement.querySelector('.os-alert__dismiss');

      expect(alertElement).toBeTruthy();
      expect(iconElement).toBeTruthy();
      expect(titleElement).toBeTruthy();
      expect(messageElement).toBeTruthy();
      expect(dismissButton).toBeTruthy();
    });
  });
});
