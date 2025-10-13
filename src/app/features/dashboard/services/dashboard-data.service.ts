import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';

import { ApiService } from '../../../core/services/api/api.service';
import { GetBudgetsResponseDto } from '../../../../dtos/budget/get-budgets-response-dto';
import { GetBudgetOverviewResponseDto } from '../../../../dtos/budget/get-budget-overview-response-dto';
import { DashboardData, DashboardMetrics } from '../types/dashboard.types';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private readonly apiService = inject(ApiService);

  private readonly _budgets = signal<GetBudgetsResponseDto['data']>([]);
  private readonly _budgetOverview = signal<GetBudgetOverviewResponseDto['data'] | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly budgets = this._budgets.asReadonly();
  readonly budgetOverview = this._budgetOverview.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasBudgets = computed(() => this._budgets().length > 0);
  readonly hasOverview = computed(() => this._budgetOverview() !== null);

  readonly dashboardData = computed(
    (): DashboardData => ({
      budgetOverview: this._budgetOverview(),
      isLoading: this._isLoading(),
      error: this._error(),
    })
  );

  loadBudgets(): Observable<GetBudgetsResponseDto['data']> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.apiService.get<GetBudgetsResponseDto['data']>('budget').pipe(
      map((response) => {
        this._budgets.set(response.data);
        this._isLoading.set(false);
        return response.data;
      }),
      catchError((error) => {
        this._error.set(error.message || 'Erro ao carregar orçamentos');
        this._isLoading.set(false);
        return of([]);
      })
    );
  }

  loadBudgetOverview(budgetId: string): Observable<GetBudgetOverviewResponseDto['data'] | null> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.apiService
      .get<GetBudgetOverviewResponseDto['data']>(`budget/${budgetId}/overview`)
      .pipe(
        map((response) => {
          this._budgetOverview.set(response.data);
          this._isLoading.set(false);
          return response.data;
        }),
        catchError((error) => {
          this._error.set(error.message || 'Erro ao carregar visão geral do orçamento');
          this._isLoading.set(false);
          return of(null);
        })
      );
  }

  refreshBudgetOverview(budgetId: string): Observable<GetBudgetOverviewResponseDto['data'] | null> {
    return this.loadBudgetOverview(budgetId);
  }

  clearOverview(): void {
    this._budgetOverview.set(null);
    this._error.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }

  reset(): void {
    this._budgets.set([]);
    this._budgetOverview.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }

  private calculateMetrics(): DashboardMetrics {
    const overview = this._budgetOverview();
    if (!overview) {
      return {
        totalAccounts: 0,
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        netMonthly: 0,
        goalsProgress: 0,
        recentTransactionsCount: 0,
      };
    }

    const totalBalance = overview.totals.accountsBalance;
    const monthlyIncome = overview.totals.monthIncome;
    const monthlyExpense = overview.totals.monthExpense;
    const netMonthly = overview.totals.netMonth;

    return {
      totalAccounts: overview.accounts.length,
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      netMonthly,
      goalsProgress: 0,
      recentTransactionsCount: 0,
    };
  }
}
