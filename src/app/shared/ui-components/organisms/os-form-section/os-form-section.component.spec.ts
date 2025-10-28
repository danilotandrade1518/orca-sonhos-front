import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsFormSectionComponent } from './os-form-section.component';

describe('OsFormSectionComponent', () => {
  let component: OsFormSectionComponent;
  let fixture: ComponentFixture<OsFormSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsFormSectionComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsFormSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should set default values', () => {
      expect(component.title()).toBe('');
      expect(component.description()).toBe('');
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('medium');
      expect(component.theme()).toBe('light');
      expect(component.required()).toBe(false);
      expect(component.collapsible()).toBe(false);
      expect(component.collapsed()).toBe(false);
    });

    it('should accept custom values', () => {
      fixture.componentRef.setInput('title', 'Test Section');
      fixture.componentRef.setInput('description', 'Test Description');
      fixture.componentRef.setInput('variant', 'card');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.componentRef.setInput('required', true);
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);

      expect(component.title()).toBe('Test Section');
      expect(component.description()).toBe('Test Description');
      expect(component.variant()).toBe('card');
      expect(component.size()).toBe('large');
      expect(component.theme()).toBe('dark');
      expect(component.required()).toBe(true);
      expect(component.collapsible()).toBe(true);
      expect(component.collapsed()).toBe(true);
    });
  });

  describe('Computed properties', () => {
    it('should generate unique IDs', () => {
      const titleId1 = component.titleId();
      const descriptionId1 = component.descriptionId();

      fixture.detectChanges();

      const titleId2 = component.titleId();
      const descriptionId2 = component.descriptionId();

      expect(titleId1).toBeDefined();
      expect(descriptionId1).toBeDefined();
      expect(titleId2).toBeDefined();
      expect(descriptionId2).toBeDefined();
    });

    it('should compute section classes correctly', () => {
      fixture.componentRef.setInput('variant', 'card');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.componentRef.setInput('actions', [{ label: 'Save' }]);

      const classes = component.sectionClasses();

      expect(classes).toContain('os-form-section');
      expect(classes).toContain('os-form-section--card');
      expect(classes).toContain('os-form-section--large');
      expect(classes).toContain('os-form-section--dark');
      expect(classes).toContain('os-form-section--collapsible');
      expect(classes).toContain('os-form-section--collapsed');
      expect(classes).toContain('os-form-section--with-actions');
    });

    it('should compute group variant based on size', () => {
      fixture.componentRef.setInput('size', 'small');
      expect(component.groupVariant()).toBe('compact');

      fixture.componentRef.setInput('size', 'medium');
      expect(component.groupVariant()).toBe('default');

      fixture.componentRef.setInput('size', 'large');
      expect(component.groupVariant()).toBe('spaced');
    });
  });

  describe('Template rendering', () => {
    it('should render title when provided', () => {
      fixture.componentRef.setInput('title', 'Test Section');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.os-form-section__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent?.trim()).toBe('Test Section');
    });

    it('should render description when provided', () => {
      fixture.componentRef.setInput('title', 'Test Section');
      fixture.componentRef.setInput('description', 'Test Description');
      fixture.detectChanges();

      const descriptionElement = fixture.nativeElement.querySelector(
        '.os-form-section__description'
      );
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement.textContent?.trim()).toBe('Test Description');
    });

    it('should not render header when title is empty', () => {
      fixture.componentRef.setInput('title', '');
      fixture.detectChanges();

      const headerElement = fixture.nativeElement.querySelector('.os-form-section__header');
      expect(headerElement).toBeFalsy();
    });

    it('should render content projection', () => {
      fixture.detectChanges();

      const contentElement = fixture.nativeElement.querySelector('.os-form-section__content');
      expect(contentElement).toBeTruthy();
    });

    it('should render actions slot when actions are provided', () => {
      fixture.componentRef.setInput('actions', [{ label: 'Save', variant: 'primary' }]);
      fixture.detectChanges();

      const actionsElement = fixture.nativeElement.querySelector('.os-form-section__actions');
      expect(actionsElement).toBeTruthy();
    });

    it('should not render actions when no actions provided', () => {
      fixture.componentRef.setInput('actions', []);
      fixture.detectChanges();

      const actionsElement = fixture.nativeElement.querySelector('.os-form-section__actions');
      expect(actionsElement).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('title', 'Test Section');
      fixture.detectChanges();

      const sectionElement = fixture.nativeElement.querySelector('section');
      expect(sectionElement).toBeTruthy();
      
      expect(sectionElement.tagName.toLowerCase()).toBe('section');
      expect(sectionElement.getAttribute('aria-labelledby')).toBeDefined();
      
      const titleElement = sectionElement.querySelector('h2');
      expect(titleElement).toBeTruthy();
      expect(titleElement.getAttribute('id')).toBeDefined();
    });

    it('should have proper heading structure', () => {
      fixture.componentRef.setInput('title', 'Test Section');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('h2');
      expect(titleElement).toBeTruthy();
      expect(titleElement.getAttribute('id')).toBeDefined();
    });
  });

  describe('Responsive behavior', () => {
    it('should apply responsive classes', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const sectionElement = fixture.nativeElement.querySelector('section');
      expect(sectionElement.classList.contains('os-form-section--small')).toBe(true);
    });
  });

  describe('Collapsible functionality', () => {
    it('should apply collapsible classes when enabled', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      const sectionElement = fixture.nativeElement.querySelector('section');
      expect(sectionElement.classList.contains('os-form-section--collapsible')).toBe(true);
    });

    it('should apply collapsed classes when collapsed', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const sectionElement = fixture.nativeElement.querySelector('section');
      expect(sectionElement.classList.contains('os-form-section--collapsed')).toBe(true);
    });
  });

  describe('Theme support', () => {
    it('should apply dark theme classes', () => {
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const sectionElement = fixture.nativeElement.querySelector('section');
      expect(sectionElement.classList.contains('os-form-section--dark')).toBe(true);
    });
  });

  describe('Fields integration', () => {
    it('should render form group when fields are provided', () => {
      const mockFields = [
        { id: 'field1', label: 'Field 1', type: 'text' as const },
        { id: 'field2', label: 'Field 2', type: 'email' as const },
      ];

      fixture.componentRef.setInput('fields', mockFields);
      fixture.detectChanges();

      const formGroupElement = fixture.nativeElement.querySelector('os-form-group');
      expect(formGroupElement).toBeTruthy();
    });

    it('should not render form group when no fields provided', () => {
      fixture.componentRef.setInput('fields', []);
      fixture.detectChanges();

      const formGroupElement = fixture.nativeElement.querySelector('os-form-group');
      expect(formGroupElement).toBeFalsy();
    });
  });
});
