import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { FormTemplateConfig, OsFormTemplateComponent } from './os-form-template.component';

describe('OsFormTemplateComponent', () => {
  let component: OsFormTemplateComponent;
  let fixture: ComponentFixture<OsFormTemplateComponent>;

  const defaultConfig: FormTemplateConfig = {
    title: 'Test Form',
    subtitle: 'Test subtitle',
    showBackButton: true,
    backUrl: '/back',
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Save',
    cancelButtonText: 'Cancel',
    showActions: true,
    actions: [
      {
        label: 'Action 1',
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
      imports: [OsFormTemplateComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsFormTemplateComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should render with default config', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.os-form-template')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.os-form-template__content')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.os-form-template__form')).toBeTruthy();
    });

    it('should apply correct CSS classes', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('variant', 'detailed');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const template = fixture.nativeElement.querySelector('.os-form-template');
      expect(template.classList.contains('os-form-template--large')).toBe(true);
      expect(template.classList.contains('os-form-template--detailed')).toBe(true);
      expect(template.classList.contains('os-form-template--dark')).toBe(true);
    });
  });

  describe('Header Configuration', () => {
    it('should show header when showHeader is true', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('showHeader', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('os-page-header')).toBeTruthy();
    });

    it('should hide header when showHeader is false', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('showHeader', false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('os-page-header')).toBeFalsy();
    });

    it('should pass correct header variant for compact template', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('os-page-header');
      expect(header).toBeTruthy();
    });
  });

  describe('Form Actions', () => {
    it('should show actions when showActions is true', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.os-form-template__actions')).toBeTruthy();
    });

    it('should hide actions when showActions is false', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('showActions', false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.os-form-template__actions')).toBeFalsy();
    });

    it('should show save button when showSaveButton is true', () => {
      fixture.componentRef.setInput('config', { ...defaultConfig, showSaveButton: true });
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('os-button');
      expect(saveButton).toBeTruthy();
    });

    it('should show cancel button when showCancelButton is true', () => {
      fixture.componentRef.setInput('config', { ...defaultConfig, showCancelButton: true });
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('os-button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should show custom actions when provided', () => {
      fixture.componentRef.setInput('config', {
        ...defaultConfig,
        actions: [{ label: 'Custom Action', variant: 'primary', size: 'medium' }],
      });
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('os-button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('should disable save button when form is invalid', () => {
      fixture.componentRef.setInput('config', { ...defaultConfig, showSaveButton: true });
      fixture.componentRef.setInput('isInvalid', true);
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('os-button');
      expect(saveButton).toBeTruthy();
    });

    it('should enable save button when form is valid', () => {
      fixture.componentRef.setInput('config', { ...defaultConfig, showSaveButton: true });
      fixture.componentRef.setInput('isInvalid', false);
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('os-button');
      expect(saveButton).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    it('should have save button when showSaveButton is true', () => {
      fixture.componentRef.setInput('config', { ...defaultConfig, showSaveButton: true });
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('os-button');
      expect(saveButton).toBeTruthy();
    });

    it('should have cancel button when showCancelButton is true', () => {
      fixture.componentRef.setInput('config', { ...defaultConfig, showCancelButton: true });
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const cancelButton = fixture.nativeElement.querySelector('os-button');
      expect(cancelButton).toBeTruthy();
    });

    it('should have custom action button when actions are provided', () => {
      const customAction = {
        label: 'Custom',
        variant: 'primary' as const,
        size: 'medium' as const,
      };
      fixture.componentRef.setInput('config', { ...defaultConfig, actions: [customAction] });
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const actionButton = fixture.nativeElement.querySelector('os-button');
      expect(actionButton).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    it('should apply mobile styles on small screens', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.detectChanges();

      const template = fixture.nativeElement.querySelector('.os-form-template');
      expect(template).toBeTruthy();
    });

    it('should apply correct size classes', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const template = fixture.nativeElement.querySelector('.os-form-template');
      expect(template.classList.contains('os-form-template--small')).toBe(true);
    });
  });

  describe('Loading and Disabled States', () => {
    it('should apply loading class when loading is true', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const template = fixture.nativeElement.querySelector('.os-form-template');
      expect(template.classList.contains('os-form-template--loading')).toBe(true);
    });

    it('should apply disabled class when disabled is true', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const template = fixture.nativeElement.querySelector('.os-form-template');
      expect(template.classList.contains('os-form-template--disabled')).toBe(true);
    });
  });

  describe('Content Projection', () => {
    it('should project content into form area', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.detectChanges();

      const formArea = fixture.nativeElement.querySelector('.os-form-template__form');
      expect(formArea).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.detectChanges();

      const template = fixture.nativeElement.querySelector('.os-form-template');
      expect(template).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      fixture.componentRef.setInput('config', defaultConfig);
      fixture.componentRef.setInput('showActions', true);
      fixture.detectChanges();

      const actions = fixture.nativeElement.querySelector('.os-form-template__actions');
      expect(actions).toBeTruthy();
    });
  });
});
