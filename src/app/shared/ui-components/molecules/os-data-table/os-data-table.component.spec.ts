import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import {
  OsDataTableComponent,
  OsDataTableColumn,
  OsDataTableAction,
} from './os-data-table.component';

describe('OsDataTableComponent', () => {
  let component: OsDataTableComponent;
  let fixture: ComponentFixture<OsDataTableComponent>;

  const mockData = [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
  ];

  const mockColumns: OsDataTableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'value', label: 'Value', sortable: false, align: 'right' },
  ];

  const mockActions: OsDataTableAction[] = [
    { key: 'edit', label: 'Edit', icon: 'edit' },
    { key: 'delete', label: 'Delete', icon: 'delete', color: 'warn' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsDataTableComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsDataTableComponent);
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table with data', () => {
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();

    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(2);
  });

  it('should render columns correctly', () => {
    const headerCells = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
    expect(headerCells.length).toBe(3);

    expect(headerCells[0].textContent.trim()).toBe('ID');
    expect(headerCells[1].textContent.trim()).toBe('Name');
    expect(headerCells[2].textContent.trim()).toBe('Value');
  });

  it('should apply size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const dataTable = fixture.nativeElement.querySelector('.os-data-table');
    expect(dataTable.classList.contains('os-data-table--large')).toBe(true);
  });

  it('should apply variant classes', () => {
    fixture.componentRef.setInput('variant', 'striped');
    fixture.detectChanges();

    const dataTable = fixture.nativeElement.querySelector('.os-data-table');
    expect(dataTable.classList.contains('os-data-table--striped')).toBe(true);
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('title', 'Test Table');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.os-data-table__title');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Test Table');
  });

  it('should render actions when provided', () => {
    fixture.componentRef.setInput('actions', mockActions);
    fixture.componentRef.setInput('showActions', true);
    fixture.componentRef.setInput('title', 'Test Table'); // Adicionar título para renderizar header
    fixture.detectChanges();

    // Verificar se o container de ações existe
    const actionsContainer = fixture.nativeElement.querySelector('.os-data-table__actions');
    expect(actionsContainer).toBeTruthy();

    const actionButtons = fixture.nativeElement.querySelectorAll('.os-data-table__actions button');
    expect(actionButtons.length).toBe(2);
  });

  it('should emit rowClick when row is clicked', () => {
    vi.spyOn(component.rowClick, 'emit');

    const row = fixture.nativeElement.querySelector('tr[mat-row]');
    row.click();

    expect(component.rowClick.emit).toHaveBeenCalledWith(mockData[0]);
  });

  it('should emit actionClick when action button is clicked', () => {
    vi.spyOn(component.actionClick, 'emit');

    fixture.componentRef.setInput('actions', mockActions);
    fixture.componentRef.setInput('showActions', true);
    fixture.componentRef.setInput('title', 'Test Table'); // Adicionar título para renderizar header
    fixture.detectChanges();

    const actionButton = fixture.nativeElement.querySelector('.os-data-table__actions button');
    expect(actionButton).toBeTruthy();
    actionButton.click();

    expect(component.actionClick.emit).toHaveBeenCalledWith(mockActions[0]);
  });

  it('should show no data message when data is empty', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();

    const noDataElement = fixture.nativeElement.querySelector('.os-data-table__no-data');
    expect(noDataElement).toBeTruthy();
    expect(noDataElement.textContent.trim()).toContain('Nenhum dado encontrado');
  });

  it('should not show no data message when showNoData is false', () => {
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('showNoData', false);
    fixture.detectChanges();

    const noDataElement = fixture.nativeElement.querySelector('.os-data-table__no-data');
    expect(noDataElement).toBeFalsy();
  });

  it('should show paginator when showPagination is true and data exists', () => {
    fixture.componentRef.setInput('showPagination', true);
    fixture.detectChanges();

    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should not show paginator when showPagination is false', () => {
    fixture.componentRef.setInput('showPagination', false);
    fixture.detectChanges();

    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    expect(paginator).toBeFalsy();
  });

  it('should emit pageChange when paginator page changes', () => {
    vi.spyOn(component.pageChange, 'emit');

    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 20 };
    paginator.dispatchEvent(new CustomEvent('page', { detail: pageEvent }));

    expect(component.pageChange.emit).toHaveBeenCalled();
  });

  it('should apply sortable class to sortable columns', () => {
    const headerCells = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
    expect(headerCells[0].classList.contains('os-data-table__header-cell--sortable')).toBe(true);
    expect(headerCells[1].classList.contains('os-data-table__header-cell--sortable')).toBe(true);
    expect(headerCells[2].classList.contains('os-data-table__header-cell--sortable')).toBe(false);
  });

  it('should apply alignment classes to cells', () => {
    const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
    const valueCell = Array.from(cells).find(
      (cell) =>
        (cell as HTMLElement).textContent?.trim() === '100' ||
        (cell as HTMLElement).textContent?.trim() === '200'
    ) as HTMLElement;
    expect(valueCell?.classList.contains('os-data-table__cell--right')).toBe(true);
  });

  it('should have correct default values', () => {
    expect(component.size()).toBe('medium');
    expect(component.variant()).toBe('default');
    expect(component.sortable()).toBe(true);
    expect(component.showActions()).toBe(true);
    expect(component.showPagination()).toBe(true);
    expect(component.showNoData()).toBe(true);
    expect(component.pageSize()).toBe(10);
    expect(component.pageIndex()).toBe(0);
    expect(component.totalItems()).toBe(0);
  });

  it('should get cell value correctly', () => {
    const value = component.getCellValue(mockData[0], 'name');
    expect(value).toBe('Item 1');
  });

  it('should compute displayed columns correctly', () => {
    const displayedColumns = component.displayedColumns();
    expect(displayedColumns).toEqual(['id', 'name', 'value']);
  });
});
