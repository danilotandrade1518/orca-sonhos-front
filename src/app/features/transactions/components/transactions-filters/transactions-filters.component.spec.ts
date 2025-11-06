import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TransactionsFiltersComponent,
  type TransactionsFilters,
} from './transactions-filters.component';

describe('TransactionsFiltersComponent', () => {
  let component: TransactionsFiltersComponent;
  let fixture: ComponentFixture<TransactionsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsFiltersComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no active filters by default', () => {
    expect(component['filters']()).toEqual({});
    expect(component.hasActiveFilters()).toBe(false);
  });

  it('should update filters on onFilterChange and emit on apply', () => {
    const spy = vi.fn();
    component.filtersChange.subscribe(spy);
    
    const accountInput = { target: { value: 'acc-1' } } as unknown as Event;
    component.onFilterChange('accountId', accountInput);
    expect(component['filters']().accountId).toBe('acc-1');
    expect(component.hasActiveFilters()).toBe(true);
    
    const amountInput = { target: { value: '100' } } as unknown as Event;
    component.onFilterChange('amount', amountInput);
    expect(component['filters']().amount).toBe(100);

    component.onApplyFilters();
    expect(spy).toHaveBeenCalledWith({ accountId: 'acc-1', amount: 100 });
  });

  it('should clear filters and emit {} on clear', () => {
    const spy = vi.fn();
    component.filtersChange.subscribe(spy);

    const accountInput = { target: { value: 'acc-1' } } as unknown as Event;
    component.onFilterChange('accountId', accountInput);
    expect(component.hasActiveFilters()).toBe(true);

    component.onClearFilters();
    expect(component['filters']()).toEqual({});
    expect(component.hasActiveFilters()).toBe(false);
    expect(spy).toHaveBeenCalledWith({});
  });

  it('should restore filters and emit restored object', () => {
    const spy = vi.fn();
    component.filtersChange.subscribe(spy);

    const restored = {
      accountId: 'acc-1',
      categoryId: 'cat-1',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
      type: 'income',
      amount: '250',
    } as Record<string, unknown>;

    component.onFiltersRestored(restored);

    const expected: TransactionsFilters = {
      accountId: 'acc-1',
      categoryId: 'cat-1',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
      type: 'income',
      amount: 250,
    };

    expect(component['filters']()).toEqual(expected);
    expect(spy).toHaveBeenCalledWith(expected);
  });
});

