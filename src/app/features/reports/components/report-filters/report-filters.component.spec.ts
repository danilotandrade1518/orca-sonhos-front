import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReportFiltersComponent } from './report-filters.component';
import { ReportPeriod } from '../../types/reports.types';
import type { BudgetOption } from '@shared/ui-components/molecules/os-budget-selector/os-budget-selector.component';

describe('ReportFiltersComponent', () => {
  let component: ReportFiltersComponent;
  let fixture: ComponentFixture<ReportFiltersComponent>;

  const mockBudgets: BudgetOption[] = [
    { id: '1', name: 'Orçamento 1', isActive: true, isShared: false },
    { id: '2', name: 'Orçamento 2', isActive: true, isShared: false },
    { id: '3', name: 'Orçamento 3', isActive: true, isShared: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFiltersComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportFiltersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default properties', () => {
    it('should have default period as CURRENT_MONTH', () => {
      fixture.detectChanges();
      expect(component.selectedPeriod()).toBe(ReportPeriod.CURRENT_MONTH);
    });

    it('should have empty budgets array by default', () => {
      fixture.detectChanges();
      expect(component.budgets()).toEqual([]);
    });

    it('should show budget selector by default', () => {
      fixture.detectChanges();
      expect(component.showBudgetSelector()).toBe(true);
    });

    it('should have null selectedBudgetId by default', () => {
      fixture.detectChanges();
      expect(component.selectedBudgetId()).toBeNull();
    });
  });

  describe('periodOptions computed', () => {
    it('should return correct period options', () => {
      
      fixture.detectChanges();
      
      const options = component.periodOptions();
      expect(options).toHaveLength(3);
      expect(options[0]).toEqual({ value: ReportPeriod.CURRENT_MONTH, label: 'Mês Atual' });
      expect(options[1]).toEqual({ value: ReportPeriod.LAST_MONTH, label: 'Mês Anterior' });
      expect(options[2]).toEqual({ value: ReportPeriod.LAST_3_MONTHS, label: 'Últimos 3 Meses' });
    });
  });

  describe('hasActiveFilters computed', () => {
    it('should return false when period is CURRENT_MONTH and no budget selected', () => {
      
      fixture.detectChanges();
      
      expect(component.hasActiveFilters()).toBe(false);
    });

    it('should return true when period is not CURRENT_MONTH', () => {
      
      fixture.detectChanges();
      component.onPeriodChange(ReportPeriod.LAST_MONTH);
      fixture.detectChanges();
      
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should return true when budget is selected', () => {
      
      fixture.componentRef.setInput('budgets', mockBudgets);
      fixture.detectChanges();
      component.onBudgetChange(mockBudgets[0]);
      fixture.detectChanges();
      
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('onPeriodChange', () => {
    it('should update selected period', () => {
      
      fixture.detectChanges();
      
      component.onPeriodChange(ReportPeriod.LAST_MONTH);
      fixture.detectChanges();
      
      expect(component.selectedPeriod()).toBe(ReportPeriod.LAST_MONTH);
    });

    it('should emit filtersChange when period changes', () => {
      
      const filtersChangeSpy = vi.fn();
      component.filtersChange.subscribe(filtersChangeSpy);
      fixture.detectChanges();
      
      component.onPeriodChange(ReportPeriod.LAST_MONTH);
      fixture.detectChanges();
      
      expect(filtersChangeSpy).toHaveBeenCalled();
      const lastCall = filtersChangeSpy.mock.calls[filtersChangeSpy.mock.calls.length - 1][0];
      expect(lastCall.period).toBe(ReportPeriod.LAST_MONTH);
    });
  });

  describe('onBudgetChange', () => {
    it('should update selected budget', () => {
      
      fixture.componentRef.setInput('budgets', mockBudgets);
      fixture.detectChanges();
      
      component.onBudgetChange(mockBudgets[0]);
      fixture.detectChanges();
      
      expect(component.hasActiveFilters()).toBe(true);
    });

    it('should emit filtersChange when budget changes', () => {
      
      fixture.componentRef.setInput('budgets', mockBudgets);
      const filtersChangeSpy = vi.fn();
      component.filtersChange.subscribe(filtersChangeSpy);
      fixture.detectChanges();
      
      component.onBudgetChange(mockBudgets[0]);
      fixture.detectChanges();
      
      expect(filtersChangeSpy).toHaveBeenCalled();
      const lastCall = filtersChangeSpy.mock.calls[filtersChangeSpy.mock.calls.length - 1][0];
      expect(lastCall.budgetId).toBe('1');
    });
  });

  describe('clearFilters', () => {
    it('should reset period to CURRENT_MONTH', () => {
      
      fixture.detectChanges();
      component.onPeriodChange(ReportPeriod.LAST_MONTH);
      fixture.detectChanges();
      
      component.clearFilters();
      fixture.detectChanges();
      
      expect(component.selectedPeriod()).toBe(ReportPeriod.CURRENT_MONTH);
    });

    it('should clear budget selection', () => {
      
      fixture.componentRef.setInput('budgets', mockBudgets);
      fixture.detectChanges();
      component.onBudgetChange(mockBudgets[0]);
      fixture.detectChanges();
      
      component.clearFilters();
      fixture.detectChanges();
      
      expect(component.hasActiveFilters()).toBe(false);
    });
  });

  describe('initialFilters effect', () => {
    it('should set period from initialFilters', () => {
      
      fixture.componentRef.setInput('initialFilters', { period: ReportPeriod.LAST_MONTH });
      fixture.detectChanges();
      
      expect(component.selectedPeriod()).toBe(ReportPeriod.LAST_MONTH);
    });

    it('should set budgetId from initialFilters', () => {
      
      fixture.componentRef.setInput('initialFilters', { budgetId: '1' });
      fixture.detectChanges();
      
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('selectedBudgetId effect', () => {
    it('should update budget when selectedBudgetId input changes', () => {
      
      fixture.componentRef.setInput('budgets', mockBudgets);
      fixture.detectChanges();
      
      fixture.componentRef.setInput('selectedBudgetId', '2');
      fixture.detectChanges();
      
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  describe('filtersChange output', () => {
    it('should emit filters on initialization', () => {
      
      const filtersChangeSpy = vi.fn();
      component.filtersChange.subscribe(filtersChangeSpy);
      
      fixture.detectChanges();
      
      expect(filtersChangeSpy).toHaveBeenCalled();
      const filters = filtersChangeSpy.mock.calls[0][0];
      expect(filters.period).toBe(ReportPeriod.CURRENT_MONTH);
      expect(filters.budgetId).toBeUndefined();
    });

    it('should emit filters with updated values when period changes', () => {
      
      const filtersChangeSpy = vi.fn();
      component.filtersChange.subscribe(filtersChangeSpy);
      fixture.detectChanges();
      filtersChangeSpy.mockClear();
      
      component.onPeriodChange(ReportPeriod.LAST_3_MONTHS);
      fixture.detectChanges();
      
      expect(filtersChangeSpy).toHaveBeenCalled();
      const filters = filtersChangeSpy.mock.calls[0][0];
      expect(filters.period).toBe(ReportPeriod.LAST_3_MONTHS);
    });
  });

  describe('inputs', () => {
    it('should accept budgets input', () => {
      
      fixture.componentRef.setInput('budgets', mockBudgets);
      fixture.detectChanges();
      
      expect(component.budgets()).toEqual(mockBudgets);
    });

    it('should accept selectedBudgetId input', () => {
      
      fixture.componentRef.setInput('selectedBudgetId', '1');
      fixture.detectChanges();
      
      expect(component.selectedBudgetId()).toBe('1');
    });

    it('should accept showBudgetSelector input', () => {
      
      fixture.componentRef.setInput('showBudgetSelector', false);
      fixture.detectChanges();
      
      expect(component.showBudgetSelector()).toBe(false);
    });

    it('should accept initialFilters input', () => {
      
      const initialFilters = { period: ReportPeriod.LAST_MONTH, budgetId: '1' };
      fixture.componentRef.setInput('initialFilters', initialFilters);
      fixture.detectChanges();
      
      expect(component.selectedPeriod()).toBe(ReportPeriod.LAST_MONTH);
    });
  });
});
