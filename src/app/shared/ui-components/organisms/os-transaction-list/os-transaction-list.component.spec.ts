import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { OsDataTableComponent } from '../../molecules/os-data-table/os-data-table.component';
import { OsFilterBarComponent } from '../../molecules/os-filter-bar/os-filter-bar.component';
import { OsTransactionListComponent, Transaction } from './os-transaction-list.component';

describe('OsTransactionListComponent', () => {
  let component: OsTransactionListComponent;
  let fixture: ComponentFixture<OsTransactionListComponent>;

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      description: 'Salário',
      amount: 5000,
      date: new Date('2024-01-01'),
      category: 'Receita',
      type: 'income',
      status: 'completed',
      account: 'Conta Corrente',
      tags: ['salário'],
    },
    {
      id: '2',
      description: 'Aluguel',
      amount: -1200,
      date: new Date('2024-01-02'),
      category: 'Moradia',
      type: 'expense',
      status: 'completed',
      account: 'Conta Corrente',
      tags: ['moradia'],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OsTransactionListComponent,
        OsButtonComponent,
        OsIconComponent,
        OsSpinnerComponent,
        OsDataTableComponent,
        OsFilterBarComponent,
      ],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OsTransactionListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('transactions', mockTransactions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default props', () => {
    expect(component.variant()).toBe('default');
    expect(component.size()).toBe('medium');
    expect(component.theme()).toBe('light');
  });

  it('should apply correct CSS classes', () => {
    const classes = component.transactionListClasses();
    expect(classes).toContain('os-transaction-list');
    expect(classes).toContain('os-transaction-list--default');
    expect(classes).toContain('os-transaction-list--medium');
    expect(classes).toContain('os-transaction-list--light');
  });

  it('should compute filtered transactions correctly', () => {
    const filtered = component.filteredTransactions();
    expect(filtered).toEqual(mockTransactions);
  });

  it('should compute total items correctly', () => {
    const total = component.totalItems();
    expect(total).toBe(2);
  });

  it('should compute has active filters correctly', () => {
    expect(component.hasActiveFilters()).toBe(false);
  });

  it('should compute table columns correctly', () => {
    const columns = component.tableColumns();
    expect(columns.length).toBeGreaterThan(0);
    expect(columns[0].key).toBe('description');
  });

  it('should compute table actions correctly', () => {
    const actions = component.tableActions();
    expect(actions.length).toBe(2);
    expect(actions[0].key).toBe('edit');
    expect(actions[1].key).toBe('delete');
  });

  it('should get transaction value correctly', () => {
    const transaction = mockTransactions[0];

    expect(component.getTransactionValue(transaction, 'description')).toBe('Salário');
    expect(component.getTransactionValue(transaction, 'amount')).toBe(5000);
    expect(component.getTransactionValue(transaction, 'type')).toBe('income');
  });

  it('should match filters correctly', () => {
    expect(component.matchesFilter('Salário', 'Salário', 'equals')).toBe(true);
    expect(component.matchesFilter('Salário', 'sal', 'contains')).toBe(true);
  });

  it('should get filter value correctly', () => {
    component['filters'].set([{ key: 'description', value: 'test', operator: 'contains' }]);

    expect(component.getFilterValue('description')).toBe('test');
    expect(component.getFilterValue('nonexistent')).toBe('');
  });

  it('should get item count text correctly', () => {
    const itemCountText = component.getItemCountText();
    expect(itemCountText).toContain('de');
    expect(itemCountText).toContain('transações');
  });

  it('should emit refresh event', () => {
    const refreshSpy = vi.spyOn(component.refresh, 'emit');

    component.onRefresh();

    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should emit export event', () => {
    const exportSpy = vi.spyOn(component.export, 'emit');

    component.onExport();

    expect(exportSpy).toHaveBeenCalled();
  });

  it('should emit add event', () => {
    const addSpy = vi.spyOn(component.add, 'emit');

    component.onAdd();

    expect(addSpy).toHaveBeenCalled();
  });

  it('should emit row click event', () => {
    const rowClickSpy = vi.spyOn(component.rowClick, 'emit');
    const transaction = mockTransactions[0];

    component.onRowClick(transaction);

    expect(rowClickSpy).toHaveBeenCalledWith(transaction);
  });

  it('should map button size correctly', () => {
    fixture.componentRef.setInput('size', 'small');
    expect(component.getButtonSize()).toBe('small');

    fixture.componentRef.setInput('size', 'medium');
    expect(component.getButtonSize()).toBe('medium');

    fixture.componentRef.setInput('size', 'large');
    expect(component.getButtonSize()).toBe('large');
  });

  it('should map filter bar variant correctly', () => {
    fixture.componentRef.setInput('variant', 'default');
    expect(component.getFilterBarVariant()).toBe('default');

    fixture.componentRef.setInput('variant', 'compact');
    expect(component.getFilterBarVariant()).toBe('compact');

    fixture.componentRef.setInput('variant', 'detailed');
    expect(component.getFilterBarVariant()).toBe('expanded');
  });

  it('should map table size correctly', () => {
    fixture.componentRef.setInput('size', 'small');
    expect(component.getTableSize()).toBe('small');

    fixture.componentRef.setInput('size', 'medium');
    expect(component.getTableSize()).toBe('medium');

    fixture.componentRef.setInput('size', 'large');
    expect(component.getTableSize()).toBe('large');
  });
});
