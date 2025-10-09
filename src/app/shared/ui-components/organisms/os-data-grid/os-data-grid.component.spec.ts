import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { OsDataGridComponent, OsDataGridSize, OsDataGridVariant } from './os-data-grid.component';
import {
  OsDataTableColumn,
  OsDataTableAction,
} from '../../molecules/os-data-table/os-data-table.component';
import { OsFilterOption } from '../../molecules/os-filter-bar/os-filter-bar.component';

describe('OsDataGridComponent', () => {
  let component: OsDataGridComponent;
  let fixture: ComponentFixture<OsDataGridComponent>;

  const mockData = [
    { id: 1, name: 'Item 1', category: 'A', value: 100, date: '2024-01-01' },
    { id: 2, name: 'Item 2', category: 'B', value: 200, date: '2024-01-02' },
    { id: 3, name: 'Item 3', category: 'A', value: 150, date: '2024-01-03' },
  ];

  const mockColumns: OsDataTableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'category', label: 'Categoria', sortable: true },
    { key: 'value', label: 'Valor', sortable: true, align: 'right' },
    { key: 'date', label: 'Data', sortable: true },
  ];

  const mockFilterOptions: OsFilterOption[] = [
    { key: 'name', label: 'Nome', type: 'text', value: '' },
    {
      key: 'category',
      label: 'Categoria',
      type: 'select',
      value: '',
      options: [
        { value: 'A', label: 'Categoria A' },
        { value: 'B', label: 'Categoria B' },
      ],
    },
    { key: 'value', label: 'Valor', type: 'number', value: '' },
    { key: 'date', label: 'Data', type: 'date', value: '' },
  ];

  const mockActions: OsDataTableAction[] = [
    { key: 'edit', label: 'Editar', icon: 'edit', color: 'primary' },
    { key: 'delete', label: 'Excluir', icon: 'delete', color: 'warn' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsDataGridComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDataGridComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('filterOptions', mockFilterOptions);
    fixture.componentRef.setInput('tableActions', mockActions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have default values', () => {
      expect(component.size()).toBe('medium');
      expect(component.variant()).toBe('default');
      expect(component.showHeaderActions()).toBe(true);
      expect(component.showFilters()).toBe(true);
      expect(component.showPagination()).toBe(true);
      expect(component.showNoData()).toBe(true);
      expect(component.showFooter()).toBe(true);
      expect(component.showItemCount()).toBe(true);
      expect(component.showLastUpdated()).toBe(true);
      expect(component.showFooterActions()).toBe(false);
      expect(component.isLoading()).toBe(false);
    });

    it('should accept custom values', () => {
      fixture.componentRef.setInput('title', 'Test Grid');
      fixture.componentRef.setInput('subtitle', 'Test Subtitle');
      fixture.componentRef.setInput('size', 'large' as OsDataGridSize);
      fixture.componentRef.setInput('variant', 'detailed' as OsDataGridVariant);
      fixture.componentRef.setInput('showHeaderActions', false);
      fixture.componentRef.setInput('showFilters', false);
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      expect(component.title()).toBe('Test Grid');
      expect(component.subtitle()).toBe('Test Subtitle');
      expect(component.size()).toBe('large');
      expect(component.variant()).toBe('detailed');
      expect(component.showHeaderActions()).toBe(false);
      expect(component.showFilters()).toBe(false);
      expect(component.isLoading()).toBe(true);
    });
  });

  describe('CSS Classes', () => {
    it('should apply base classes', () => {
      const classes = component.dataGridClasses();
      expect(classes).toContain('os-data-grid');
    });

    it('should apply size classes', () => {
      fixture.componentRef.setInput('size', 'small' as OsDataGridSize);
      fixture.detectChanges();

      const classes = component.dataGridClasses();
      expect(classes).toContain('os-data-grid--small');
    });

    it('should apply variant classes', () => {
      fixture.componentRef.setInput('variant', 'compact' as OsDataGridVariant);
      fixture.detectChanges();

      const classes = component.dataGridClasses();
      expect(classes).toContain('os-data-grid--compact');
    });

    it('should apply loading class when loading', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const classes = component.dataGridClasses();
      expect(classes).toContain('os-data-grid--loading');
    });
  });

  describe('Filtering', () => {
    it('should filter data correctly', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      // Simulate filter change
      component['onFilterChange']('name', { target: { value: 'Item 1' } });
      fixture.detectChanges();

      const filteredData = component.filteredData();
      expect(filteredData.length).toBe(1);
      expect(filteredData[0].name).toBe('Item 1');
    });

    it('should handle multiple filters', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      // Apply first filter
      component['onFilterChange']('category', { target: { value: 'A' } });
      fixture.detectChanges();

      // Apply second filter
      component['onFilterChange']('value', { target: { value: '100' } });
      fixture.detectChanges();

      const filteredData = component.filteredData();
      expect(filteredData.length).toBe(1);
      expect(filteredData[0].category).toBe('A');
      expect(filteredData[0].value).toBe(100);
    });

    it('should clear filters', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      // Apply filter
      component['onFilterChange']('name', { target: { value: 'Item 1' } });
      fixture.detectChanges();

      // Clear filters
      component.onClearFilters();
      fixture.detectChanges();

      const filteredData = component.filteredData();
      expect(filteredData.length).toBe(3);
    });

    it('should detect active filters', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      expect(component.hasActiveFilters()).toBe(false);

      // Apply filter
      component['onFilterChange']('name', { target: { value: 'Item 1' } });
      fixture.detectChanges();

      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('Sorting', () => {
    it('should sort data correctly', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      // Apply sorting
      component['onSortChange']({ active: 'name', direction: 'asc' });
      fixture.detectChanges();

      const sortedData = component.filteredData();
      expect(sortedData[0].name).toBe('Item 1');
      expect(sortedData[1].name).toBe('Item 2');
      expect(sortedData[2].name).toBe('Item 3');
    });

    it('should sort in descending order', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      // Apply sorting
      component['onSortChange']({ active: 'name', direction: 'desc' });
      fixture.detectChanges();

      const sortedData = component.filteredData();
      expect(sortedData[0].name).toBe('Item 3');
      expect(sortedData[1].name).toBe('Item 2');
      expect(sortedData[2].name).toBe('Item 1');
    });
  });

  describe('Pagination', () => {
    it('should paginate data correctly', () => {
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        category: 'A',
        value: (i + 1) * 10,
      }));

      fixture.componentRef.setInput('data', largeData);
      fixture.detectChanges();

      // Set page size to 10
      component['onPageChange']({ pageIndex: 0, pageSize: 10 });
      fixture.detectChanges();

      const paginatedData = component.filteredData();
      expect(paginatedData.length).toBe(10);
      expect(paginatedData[0].id).toBe(1);
      expect(paginatedData[9].id).toBe(10);
    });

    it('should handle page changes', () => {
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        category: 'A',
        value: (i + 1) * 10,
      }));

      fixture.componentRef.setInput('data', largeData);
      fixture.detectChanges();

      // Go to page 2
      component['onPageChange']({ pageIndex: 1, pageSize: 10 });
      fixture.detectChanges();

      const paginatedData = component.filteredData();
      expect(paginatedData.length).toBe(10);
      expect(paginatedData[0].id).toBe(11);
      expect(paginatedData[9].id).toBe(20);
    });
  });

  describe('Event Handlers', () => {
    it('should emit refresh event', () => {
      vi.spyOn(component.refresh, 'emit');
      component.onRefresh();
      expect(component.refresh.emit).toHaveBeenCalled();
    });

    it('should emit export event', () => {
      vi.spyOn(component.export, 'emit');
      component.onExport();
      expect(component.export.emit).toHaveBeenCalled();
    });

    it('should emit add event', () => {
      vi.spyOn(component.add, 'emit');
      component.onAdd();
      expect(component.add.emit).toHaveBeenCalled();
    });

    it('should emit row click event', () => {
      vi.spyOn(component.rowClick, 'emit');
      const testRow = { id: 1, name: 'Test' };
      component.onRowClick(testRow);
      expect(component.rowClick.emit).toHaveBeenCalledWith(testRow);
    });

    it('should emit table action click event', () => {
      vi.spyOn(component.tableActionClick, 'emit');
      const testAction = { key: 'edit', label: 'Edit', icon: 'edit' };
      component.onTableActionClick(testAction);
      expect(component.tableActionClick.emit).toHaveBeenCalledWith(testAction);
    });

    it('should emit filter change event', () => {
      vi.spyOn(component.filterChange, 'emit');
      component.onApplyFilters();
      expect(component.filterChange.emit).toHaveBeenCalled();
    });

    it('should emit sort change event', () => {
      vi.spyOn(component.sortChange, 'emit');
      component['onSortChange']({ active: 'name', direction: 'asc' });
      expect(component.sortChange.emit).toHaveBeenCalled();
    });

    it('should emit page change event', () => {
      vi.spyOn(component.pageChange, 'emit');
      component['onPageChange']({ pageIndex: 1, pageSize: 10 });
      expect(component.pageChange.emit).toHaveBeenCalled();
    });
  });

  describe('Helper Methods', () => {
    it('should get filter value correctly', () => {
      component['onFilterChange']('name', { target: { value: 'Test' } });
      const value = component.getFilterValue('name');
      expect(value).toBe('Test');
    });

    it('should get item count text correctly', () => {
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const text = component.getItemCountText();
      expect(text).toContain('Mostrando');
      expect(text).toContain('de 3 itens');
    });

    it('should handle empty data for item count', () => {
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();

      const text = component.getItemCountText();
      expect(text).toBe('Nenhum item encontrado');
    });
  });

  describe('Size Mapping', () => {
    it('should map button size correctly', () => {
      fixture.componentRef.setInput('size', 'small' as OsDataGridSize);
      expect(component.getButtonSize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium' as OsDataGridSize);
      expect(component.getButtonSize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large' as OsDataGridSize);
      expect(component.getButtonSize()).toBe('large');
    });

    it('should map filter bar variant correctly', () => {
      fixture.componentRef.setInput('variant', 'default' as OsDataGridVariant);
      expect(component.getFilterBarVariant()).toBe('default');

      fixture.componentRef.setInput('variant', 'compact' as OsDataGridVariant);
      expect(component.getFilterBarVariant()).toBe('compact');

      fixture.componentRef.setInput('variant', 'detailed' as OsDataGridVariant);
      expect(component.getFilterBarVariant()).toBe('expanded');
    });

    it('should map table size correctly', () => {
      fixture.componentRef.setInput('size', 'small' as OsDataGridSize);
      expect(component.getTableSize()).toBe('small');

      fixture.componentRef.setInput('size', 'medium' as OsDataGridSize);
      expect(component.getTableSize()).toBe('medium');

      fixture.componentRef.setInput('size', 'large' as OsDataGridSize);
      expect(component.getTableSize()).toBe('large');
    });

    it('should map table variant correctly', () => {
      fixture.componentRef.setInput('variant', 'default' as OsDataGridVariant);
      expect(component.getTableVariant()).toBe('default');

      fixture.componentRef.setInput('variant', 'compact' as OsDataGridVariant);
      expect(component.getTableVariant()).toBe('striped');

      fixture.componentRef.setInput('variant', 'detailed' as OsDataGridVariant);
      expect(component.getTableVariant()).toBe('bordered');
    });
  });

  describe('Filter Operators', () => {
    it('should handle equals operator', () => {
      const result = component['matchesFilter']('test', 'test', 'equals');
      expect(result).toBe(true);
    });

    it('should handle contains operator', () => {
      const result = component['matchesFilter']('testing', 'test', 'contains');
      expect(result).toBe(true);
    });

    it('should handle startsWith operator', () => {
      const result = component['matchesFilter']('testing', 'test', 'startsWith');
      expect(result).toBe(true);
    });

    it('should handle endsWith operator', () => {
      const result = component['matchesFilter']('testing', 'ing', 'endsWith');
      expect(result).toBe(true);
    });

    it('should handle numeric operators', () => {
      expect(component['matchesFilter'](100, 50, 'gt')).toBe(true);
      expect(component['matchesFilter'](50, 100, 'lt')).toBe(true);
      expect(component['matchesFilter'](100, 100, 'gte')).toBe(true);
      expect(component['matchesFilter'](100, 100, 'lte')).toBe(true);
    });
  });
});
