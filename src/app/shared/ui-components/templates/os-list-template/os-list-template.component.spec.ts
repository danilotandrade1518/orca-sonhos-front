import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';

import {
  ListTemplateAction,
  ListTemplateData,
  ListTemplateFilter,
  OsListTemplateComponent,
} from './os-list-template.component';

describe('OsListTemplateComponent', () => {
  let component: OsListTemplateComponent;
  let fixture: ComponentFixture<OsListTemplateComponent>;

  const mockData: ListTemplateData[] = [
    {
      id: '1',
      title: 'Item 1',
      subtitle: 'Subtitle 1',
      status: 'active',
      date: new Date('2024-01-01'),
      amount: 1000,
      category: 'Category 1',
      tags: ['tag1', 'tag2'],
    },
    {
      id: '2',
      title: 'Item 2',
      subtitle: 'Subtitle 2',
      status: 'inactive',
      date: new Date('2024-01-02'),
      amount: 2000,
      category: 'Category 2',
      tags: ['tag3', 'tag4'],
    },
  ];

  const mockColumns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
  ];

  const mockFilters: ListTemplateFilter[] = [
    {
      field: 'status',
      operator: 'equals',
      value: 'active',
    },
  ];

  const mockActions: ListTemplateAction[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: 'edit',
      variant: 'primary',
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'danger',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsListTemplateComponent, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsListTemplateComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.variant()).toBe('default');
      expect(component.size()).toBe('medium');
      expect(component.theme()).toBe('light');
      expect(component.data()).toEqual([]);
      expect(component.loading()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.showFilters()).toBe(true);
      expect(component.showFooter()).toBe(true);
    });
  });

  describe('Template Classes', () => {
    it('should apply correct CSS classes', () => {
      fixture.componentRef.setInput('variant', 'compact');
      fixture.componentRef.setInput('size', 'large');
      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();

      const templateElement = fixture.debugElement.query(By.css('.os-list-template'));
      expect(templateElement.nativeElement.className).toContain('os-list-template--compact');
      expect(templateElement.nativeElement.className).toContain('os-list-template--large');
      expect(templateElement.nativeElement.className).toContain('os-list-template--dark');
    });

    it('should add loading class when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const templateElement = fixture.debugElement.query(By.css('.os-list-template'));
      expect(templateElement.nativeElement.className).toContain('os-list-template--loading');
    });

    it('should add disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const templateElement = fixture.debugElement.query(By.css('.os-list-template'));
      expect(templateElement.nativeElement.className).toContain('os-list-template--disabled');
    });
  });

  describe('Header Configuration', () => {
    it('should configure header variant based on size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.headerVariant()).toBe('compact');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.headerVariant()).toBe('default');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.headerVariant()).toBe('extended');
    });

    it('should configure header size mapping', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.headerSize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.headerSize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.headerSize()).toBe('large');
    });
  });

  describe('Filter Configuration', () => {
    it('should configure filter variant based on size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.filterVariant()).toBe('compact');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.filterVariant()).toBe('default');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.filterVariant()).toBe('expanded');
    });

    it('should configure filter size mapping', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.filterSize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.filterSize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.filterSize()).toBe('large');
    });
  });

  describe('Grid Configuration', () => {
    it('should configure grid variant based on size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.gridVariant()).toBe('compact');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.gridVariant()).toBe('default');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.gridVariant()).toBe('detailed');
    });

    it('should configure grid size mapping', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.gridSize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.gridSize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.gridSize()).toBe('large');
    });
  });

  describe('Spinner Configuration', () => {
    it('should configure spinner variant based on theme', () => {
      fixture.componentRef.setInput('theme', 'light');
      fixture.detectChanges();
      expect(component.spinnerVariant()).toBe('default');

      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();
      expect(component.spinnerVariant()).toBe('secondary');
    });

    it('should configure spinner size mapping', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.spinnerSize()).toBe('sm');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.spinnerSize()).toBe('md');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.spinnerSize()).toBe('lg');
    });
  });

  describe('Empty State Configuration', () => {
    it('should configure empty icon variant based on theme', () => {
      fixture.componentRef.setInput('theme', 'light');
      fixture.detectChanges();
      expect(component.emptyIconVariant()).toBe('default');

      fixture.componentRef.setInput('theme', 'dark');
      fixture.detectChanges();
      expect(component.emptyIconVariant()).toBe('secondary');
    });

    it('should configure empty icon size mapping', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.emptyIconSize()).toBe('md');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.emptyIconSize()).toBe('lg');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.emptyIconSize()).toBe('xl');
    });
  });

  describe('Footer Configuration', () => {
    it('should configure footer action size mapping', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.footerActionSize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      expect(component.footerActionSize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.footerActionSize()).toBe('large');
    });
  });

  describe('Empty State Logic', () => {
    it('should be empty when no data and not loading', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();
      expect(component.isEmpty()).toBe(true);
    });

    it('should not be empty when has data', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();
      expect(component.isEmpty()).toBe(false);
    });

    it('should not be empty when loading', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(component.isEmpty()).toBe(false);
    });
  });

  describe('Event Handlers', () => {
    it('should emit rowClick event', () => {
      const rowClickSpy = vi.fn();
      component.rowClick.subscribe(rowClickSpy);

      component.onRowClick(mockData[0]);

      expect(rowClickSpy).toHaveBeenCalledWith({
        item: mockData[0],
        index: 0,
        event: new MouseEvent('click'),
      });
    });

    it('should emit headerActionClick event', () => {
      const headerActionClickSpy = vi.fn();
      component.headerActionClick.subscribe(headerActionClickSpy);

      const action = { label: 'Test', icon: 'test', variant: 'primary' as const };
      component.onHeaderActionClick(action);

      expect(headerActionClickSpy).toHaveBeenCalledWith(action);
    });

    it('should emit gridActionClick event', () => {
      const gridActionClickSpy = vi.fn();
      component.gridActionClick.subscribe(gridActionClickSpy);

      const action = { key: 'test', label: 'Test', icon: 'test', color: 'primary' as const };
      component.onGridActionClick(action);

      expect(gridActionClickSpy).toHaveBeenCalledWith(action);
    });

    it('should emit footerActionClick event', () => {
      const footerActionClickSpy = vi.fn();
      component.footerActionClick.subscribe(footerActionClickSpy);

      const action = mockActions[0];
      const event = new MouseEvent('click');
      component.onFooterActionClick(action, event);

      expect(footerActionClickSpy).toHaveBeenCalledWith({ action, event });
    });

    it('should emit filterChange event', () => {
      const filterChangeSpy = vi.fn();
      component.filterChange.subscribe(filterChangeSpy);

      component.onFilterChange(mockFilters);

      expect(filterChangeSpy).toHaveBeenCalledWith(mockFilters);
    });

    it('should emit sortChange event', () => {
      const sortChangeSpy = vi.fn();
      component.sortChange.subscribe(sortChangeSpy);

      const sort = { field: 'title', direction: 'asc' as const };
      component.onSortChange(sort);

      expect(sortChangeSpy).toHaveBeenCalledWith(sort);
    });

    it('should emit pageChange event', () => {
      const pageChangeSpy = vi.fn();
      component.pageChange.subscribe(pageChangeSpy);

      const page = { page: 2, pageSize: 20 };
      component.onPageChange(page);

      expect(pageChangeSpy).toHaveBeenCalledWith(page);
    });

    it('should emit refresh event', () => {
      const refreshSpy = vi.fn();
      component.refresh.subscribe(refreshSpy);

      component.onRefresh();

      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should emit export event', () => {
      const exportSpy = vi.fn();
      component.export.subscribe(exportSpy);

      component.onExport();

      expect(exportSpy).toHaveBeenCalled();
    });

    it('should emit add event', () => {
      const addSpy = vi.fn();
      component.add.subscribe(addSpy);

      component.onAdd();

      expect(addSpy).toHaveBeenCalled();
    });

    it('should emit backClick event', () => {
      const backClickSpy = vi.fn();
      component.backClick.subscribe(backClickSpy);

      const event = new MouseEvent('click');
      component.onBackClick(event);

      expect(backClickSpy).toHaveBeenCalledWith(event);
    });

    it('should emit emptyActionClick event', () => {
      const emptyActionClickSpy = vi.fn();
      component.emptyActionClick.subscribe(emptyActionClickSpy);

      const event = new MouseEvent('click');
      component.onEmptyActionClick(event);

      expect(emptyActionClickSpy).toHaveBeenCalledWith(event);
    });

    it('should emit clear filters when onClearFilters is called', () => {
      const filterChangeSpy = vi.fn();
      component.filterChange.subscribe(filterChangeSpy);

      component.onClearFilters();

      expect(filterChangeSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('Template Rendering', () => {
    it('should render loading state', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('loadingText', 'Loading data...');
      fixture.detectChanges();

      const loadingElement = fixture.debugElement.query(By.css('.os-list-template__loading'));
      expect(loadingElement).toBeTruthy();

      const loadingText = fixture.debugElement.query(By.css('.os-list-template__loading-text'));
      expect(loadingText.nativeElement.textContent).toBe('Loading data...');
    });

    it('should render empty state', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('emptyTitle', 'No items found');
      fixture.componentRef.setInput('emptyDescription', 'Try adjusting your filters');
      fixture.detectChanges();

      const emptyElement = fixture.debugElement.query(By.css('.os-list-template__empty'));
      expect(emptyElement).toBeTruthy();

      const emptyTitle = fixture.debugElement.query(By.css('.os-list-template__empty-title'));
      expect(emptyTitle.nativeElement.textContent).toBe('No items found');

      const emptyDescription = fixture.debugElement.query(
        By.css('.os-list-template__empty-description')
      );
      expect(emptyDescription.nativeElement.textContent).toBe('Try adjusting your filters');
    });

    it('should render empty action when provided', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('emptyAction', {
        id: 'add',
        label: 'Add Item',
        icon: 'plus',
        variant: 'primary',
      });
      fixture.detectChanges();

      const emptyAction = fixture.debugElement.query(By.css('.os-list-template__empty os-button'));
      expect(emptyAction).toBeTruthy();
    });

    it('should render filters when showFilters is true', () => {
      fixture.componentRef.setInput('showFilters', true);
      fixture.componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();

      const filtersElement = fixture.debugElement.query(By.css('.os-list-template__filters'));
      expect(filtersElement).toBeTruthy();
    });

    it('should not render filters when showFilters is false', () => {
      fixture.componentRef.setInput('showFilters', false);
      fixture.detectChanges();

      const filtersElement = fixture.debugElement.query(By.css('.os-list-template__filters'));
      expect(filtersElement).toBeFalsy();
    });

    it('should render footer when showFooter is true', () => {
      fixture.componentRef.setInput('showFooter', true);
      fixture.componentRef.setInput('footerText', 'Footer text');
      fixture.componentRef.setInput('footerActions', mockActions);
      fixture.detectChanges();

      const footerElement = fixture.debugElement.query(By.css('.os-list-template__footer'));
      expect(footerElement).toBeTruthy();

      const footerText = fixture.debugElement.query(By.css('.os-list-template__footer-text'));
      expect(footerText.nativeElement.textContent).toBe('Footer text');
    });

    it('should not render footer when showFooter is false', () => {
      fixture.componentRef.setInput('showFooter', false);
      fixture.detectChanges();

      const footerElement = fixture.debugElement.query(By.css('.os-list-template__footer'));
      expect(footerElement).toBeFalsy();
    });

    it('should render last update when showLastUpdate is true', () => {
      fixture.componentRef.setInput('showFooter', true);
      fixture.componentRef.setInput('showLastUpdate', true);
      fixture.componentRef.setInput('lastUpdate', new Date('2024-01-01T10:00:00Z'));
      fixture.detectChanges();

      const lastUpdateElement = fixture.debugElement.query(
        By.css('.os-list-template__footer-update')
      );
      expect(lastUpdateElement).toBeTruthy();
      expect(lastUpdateElement.nativeElement.textContent).toContain('01/01/2024');
    });

    it('should not render last update when showLastUpdate is false', () => {
      fixture.componentRef.setInput('showFooter', true);
      fixture.componentRef.setInput('showLastUpdate', false);
      fixture.detectChanges();

      const lastUpdateElement = fixture.debugElement.query(
        By.css('.os-list-template__footer-update')
      );
      expect(lastUpdateElement).toBeFalsy();
    });
  });

  describe('Data Grid Integration', () => {
    it('should pass data to data grid', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const dataGridElement = fixture.debugElement.query(By.css('os-data-grid'));
      expect(dataGridElement).toBeTruthy();
    });

    it('should pass filters to data grid', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('filters', mockFilters);
      fixture.detectChanges();

      const dataGridElement = fixture.debugElement.query(By.css('os-data-grid'));
      expect(dataGridElement).toBeTruthy();
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive classes based on size', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const templateElement = fixture.debugElement.query(By.css('.os-list-template'));
      expect(templateElement.nativeElement.className).toContain('os-list-template--small');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      fixture.componentRef.setInput('title', 'List Template');
      fixture.detectChanges();

      const templateElement = fixture.debugElement.query(By.css('.os-list-template'));
      expect(templateElement.nativeElement.getAttribute('role')).toBe('main'); // Template has main role
    });

    it('should support keyboard navigation', () => {
      fixture.detectChanges();
      const templateElement = fixture.debugElement.query(By.css('.os-list-template'));
      expect(templateElement.nativeElement.tabIndex).toBe(-1); // No tabIndex needed for template
    });
  });
});
