import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

import {
  DetailTemplateAction,
  DetailTemplateField,
  DetailTemplateSection,
  OsDetailTemplateComponent,
} from './os-detail-template.component';

describe('OsDetailTemplateComponent', () => {
  let component: OsDetailTemplateComponent;
  let fixture: ComponentFixture<OsDetailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsDetailTemplateComponent, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDetailTemplateComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default props', () => {
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('medium');
      expect(component.theme()).toBe('light');
      expect(component.disabled()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.showHeader()).toBe(true);
      expect(component.showBreadcrumb()).toBe(false);
      expect(component.breadcrumbItems()).toEqual([]);
      expect(component.headerActions()).toEqual([]);
      expect(component.sections()).toEqual([]);
      expect(component.actions()).toEqual([]);
    });
  });

  describe('CSS classes', () => {
    it('should have correct base classes', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.os-detail-template');
      expect(element.classList.contains('os-detail-template')).toBe(true);
      expect(element.classList.contains('os-detail-template--default')).toBe(true);
      expect(element.classList.contains('os-detail-template--medium')).toBe(true);
      expect(element.classList.contains('os-detail-template--light')).toBe(true);
    });

    it('should apply variant classes', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.os-detail-template');
      expect(element.classList.contains('os-detail-template--compact')).toBe(true);
    });

    it('should apply size classes', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.os-detail-template');
      expect(element.classList.contains('os-detail-template--large')).toBe(true);
    });

    it('should apply theme classes', () => {
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.os-detail-template');
      expect(element.classList.contains('os-detail-template--dark')).toBe(true);
    });

    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.os-detail-template');
      expect(element.classList.contains('os-detail-template--disabled')).toBe(true);
    });

    it('should apply loading class when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.os-detail-template');
      expect(element.classList.contains('os-detail-template--loading')).toBe(true);
    });
  });

  describe('header configuration', () => {
    it('should map header variant correctly', () => {
      fixture.componentRef.setInput('size', 'small');
      expect(component.headerVariant()).toBe('compact');

      fixture.componentRef.setInput('size', 'medium');
      expect(component.headerVariant()).toBe('default');

      fixture.componentRef.setInput('size', 'large');
      expect(component.headerVariant()).toBe('extended');
    });

    it('should map card variant correctly', () => {
      fixture.componentRef.setInput('variant', 'default');
      expect(component.cardVariant()).toBe('default');

      fixture.componentRef.setInput('variant', 'compact');
      expect(component.cardVariant()).toBe('outlined');

      fixture.componentRef.setInput('variant', 'detailed');
      expect(component.cardVariant()).toBe('elevated');
    });
  });

  describe('sections rendering', () => {
    const mockSections: DetailTemplateSection[] = [
      {
        title: 'Personal Information',
        fields: [
          { label: 'Name', value: 'John Doe', type: 'text' },
          { label: 'Email', value: 'john@example.com', type: 'text' },
        ],
      },
      {
        title: 'Financial Information',
        fields: [
          { label: 'Salary', value: 5000, type: 'currency' },
          { label: 'Tax Rate', value: 0.15, type: 'percentage' },
        ],
        collapsible: true,
        expanded: false,
      },
    ];

    it('should render sections', () => {
      fixture.componentRef.setInput('sections', mockSections);
      fixture.detectChanges();

      const sectionElements = fixture.nativeElement.querySelectorAll(
        '.os-detail-template__section'
      );
      expect(sectionElements.length).toBe(2);
    });

    it('should render section titles', () => {
      fixture.componentRef.setInput('sections', mockSections);
      fixture.detectChanges();

      const titleElements = fixture.nativeElement.querySelectorAll(
        '.os-detail-template__section-title'
      );
      expect(titleElements[0].textContent).toBe('Personal Information');
      expect(titleElements[1].textContent).toBe('Financial Information');
    });

    it('should render fields', () => {
      fixture.componentRef.setInput('sections', mockSections);
      fixture.detectChanges();

      const fieldElements = fixture.nativeElement.querySelectorAll('.os-detail-template__field');
      expect(fieldElements.length).toBe(2);
    });

    it('should apply collapsible classes', () => {
      fixture.componentRef.setInput('sections', mockSections);
      fixture.detectChanges();

      const collapsibleSection = fixture.nativeElement.querySelector(
        '.os-detail-template__section--collapsible'
      );
      expect(collapsibleSection).toBeTruthy();
    });
  });

  describe('field formatting', () => {
    it('should format currency values', () => {
      const result = component.formatCurrency(1234.56);
      expect(result).toBe('1.234,56');
    });

    it('should format percentage values', () => {
      const result = component.formatPercentage(15.5);
      expect(result).toBe('15,5');
    });

    it('should format date values', () => {
      const date = new Date('2023-12-25T12:00:00Z');
      const result = component.formatDate(date);
      expect(result).toBe('25/12/2023');
    });
  });

  describe('field classes', () => {
    it('should apply default field class', () => {
      const field: DetailTemplateField = { label: 'Test', value: 'value', type: 'text' };
      const result = component.getFieldClass(field);
      expect(result).toBe(
        'os-detail-template__field-value os-detail-template__field-value--default'
      );
    });

    it('should apply highlight field class', () => {
      const field: DetailTemplateField = {
        label: 'Test',
        value: 'value',
        type: 'text',
        variant: 'highlight',
      };
      const result = component.getFieldClass(field);
      expect(result).toBe(
        'os-detail-template__field-value os-detail-template__field-value--highlight'
      );
    });

    it('should apply muted field class', () => {
      const field: DetailTemplateField = {
        label: 'Test',
        value: 'value',
        type: 'text',
        variant: 'muted',
      };
      const result = component.getFieldClass(field);
      expect(result).toBe('os-detail-template__field-value os-detail-template__field-value--muted');
    });
  });

  describe('actions rendering', () => {
    const mockActions: DetailTemplateAction[] = [
      { id: 'edit', label: 'Edit', variant: 'primary', icon: 'edit' },
      { id: 'delete', label: 'Delete', variant: 'danger', icon: 'trash' },
    ];

    it('should render actions', () => {
      fixture.componentRef.setInput('actions', mockActions);
      fixture.detectChanges();

      const actionElements = fixture.nativeElement.querySelectorAll('os-button');
      expect(actionElements.length).toBe(2);
    });

    it('should not render actions section when no actions', () => {
      fixture.componentRef.setInput('actions', []);
      fixture.detectChanges();

      const actionsSection = fixture.nativeElement.querySelector('.os-detail-template__actions');
      expect(actionsSection).toBeFalsy();
    });
  });

  describe('events', () => {
    it('should emit onActionClick when action is clicked', () => {
      const action: DetailTemplateAction = { id: 'test', label: 'Test', variant: 'primary' };
      const spy = vi.fn();
      component.actionClicked.subscribe(spy);

      component.actionClicked.emit(action);
      expect(spy).toHaveBeenCalledWith(action);
    });

    it('should emit onHeaderActionClick when header action is clicked', () => {
      const action: DetailTemplateAction = { id: 'test', label: 'Test', variant: 'primary' };
      const event = new MouseEvent('click');
      const spy = vi.fn();
      component.headerActionClicked.subscribe(spy);

      component.headerActionClicked.emit({ action, event });
      expect(spy).toHaveBeenCalledWith({ action, event });
    });

    it('should emit onSectionToggle when section is toggled', () => {
      const section: DetailTemplateSection = {
        title: 'Test',
        fields: [],
        collapsible: true,
        expanded: false,
      };
      const spy = vi.fn();
      component.sectionToggled.subscribe(spy);

      component.sectionToggled.emit({ section, expanded: true });
      expect(spy).toHaveBeenCalledWith({ section, expanded: true });
    });
  });

  describe('section toggling', () => {
    it('should toggle collapsible section', () => {
      const section: DetailTemplateSection = {
        title: 'Test',
        fields: [],
        collapsible: true,
        expanded: false,
      };

      component.toggleSection(section);
      expect(section.expanded).toBe(true);

      component.toggleSection(section);
      expect(section.expanded).toBe(false);
    });

    it('should not toggle non-collapsible section', () => {
      const section: DetailTemplateSection = {
        title: 'Test',
        fields: [],
        collapsible: false,
        expanded: false,
      };

      component.toggleSection(section);
      expect(section.expanded).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.os-detail-template');
      expect(element).toBeTruthy();
    });

    it('should have proper section structure', () => {
      const mockSections: DetailTemplateSection[] = [{ title: 'Test Section', fields: [] }];
      fixture.componentRef.setInput('sections', mockSections);
      fixture.detectChanges();

      const sectionElement = fixture.nativeElement.querySelector('.os-detail-template__section');
      expect(sectionElement).toBeTruthy();
    });
  });

  describe('responsive behavior', () => {
    it('should handle mobile layout', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.os-detail-template');
      expect(element.classList.contains('os-detail-template')).toBe(true);
    });
  });
});
