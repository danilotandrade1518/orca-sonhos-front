import { computed, inject, Injectable, signal } from '@angular/core';

import type { CategorySpendingDto } from '../../../../../dtos/report/category-spending.dto';
import type { RevenueExpenseDto } from '../../../../../dtos/report/revenue-expense.dto';
import type { TransactionDto } from '../../../../../dtos/transaction';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { ReportsApiService } from '../../services/reports-api/reports-api.service';
import {
  ReportsCalculatorService,
  type CategoryMap,
} from '../../services/reports-calculator/reports-calculator.service';
import type { ReportFilters, ReportPeriod } from '../../types/reports.types';
import { ReportPeriod as ReportPeriodEnum } from '../../types/reports.types';

@Injectable({
  providedIn: 'root',
})
export class ReportsState {
  private readonly reportsApi: ReportsApiService = inject(ReportsApiService);
  private readonly calculator: ReportsCalculatorService = inject(ReportsCalculatorService);
  private readonly budgetSelectionService: BudgetSelectionService = inject(BudgetSelectionService);

  private readonly _transactions = signal<TransactionDto[]>([]);
  private readonly _categorySpending = signal<CategorySpendingDto[]>([]);
  private readonly _revenueExpense = signal<RevenueExpenseDto | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _filters = signal<ReportFilters>({
    period: ReportPeriodEnum.CURRENT_MONTH,
  });
  private readonly _categoryMap = signal<CategoryMap | undefined>(undefined);

  readonly transactions = this._transactions.asReadonly();
  readonly categorySpending = this._categorySpending.asReadonly();
  readonly revenueExpense = this._revenueExpense.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();

  readonly hasData = computed(() => this._transactions().length > 0);
  readonly hasCategorySpending = computed(() => this._categorySpending().length > 0);
  readonly totals = computed(() => {
    return this.calculator.calculateTotals(this._transactions());
  });

  readonly selectedBudgetId = this.budgetSelectionService.selectedBudgetId;

  async loadReports(force = false): Promise<void> {
    const budgetId = this.budgetSelectionService.selectedBudgetId();
    const filters = this._filters();

    if (!budgetId) {
      this._error.set('Nenhum orçamento selecionado');
      this._transactions.set([]);
      this._categorySpending.set([]);
      this._revenueExpense.set(null);
      this._loading.set(false);
      return;
    }

    if (!force && this._loading()) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    try {
      const transactions = await this.reportsApi.getTransactionsForReport({
        budgetId,
        period: filters.period,
      });

      this._transactions.set(transactions);

      const categoryMap = this._categoryMap();
      const categorySpending = this.calculator.calculateCategorySpending(transactions, categoryMap);
      const revenueExpense = this.calculator.calculateRevenueExpense(transactions);

      this._categorySpending.set(categorySpending);
      this._revenueExpense.set({
        ...revenueExpense,
        period: this.getPeriodLabel(filters.period),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar relatórios';
      this._error.set(errorMessage);
      this._transactions.set([]);
      this._categorySpending.set([]);
      this._revenueExpense.set(null);
    } finally {
      this._loading.set(false);
    }
  }

  updateFilters(filters: Partial<ReportFilters>): void {
    this._filters.update((current) => ({
      ...current,
      ...filters,
    }));
    this.loadReports(true);
  }

  setCategoryMap(categoryMap: CategoryMap | undefined): void {
    this._categoryMap.set(categoryMap);
    if (this._transactions().length > 0) {
      const categorySpending = this.calculator.calculateCategorySpending(
        this._transactions(),
        categoryMap
      );
      this._categorySpending.set(categorySpending);
    }
  }

  clearError(): void {
    this._error.set(null);
  }

  refresh(): void {
    this.loadReports(true);
  }

  private getPeriodLabel(period: ReportPeriod): string {
    switch (period) {
      case ReportPeriodEnum.CURRENT_MONTH:
        return 'Mês Atual';
      case ReportPeriodEnum.LAST_MONTH:
        return 'Mês Anterior';
      case ReportPeriodEnum.LAST_3_MONTHS:
        return 'Últimos 3 Meses';
      default:
        return '';
    }
  }
}
