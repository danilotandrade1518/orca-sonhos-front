import { computed, Injectable, signal } from '@angular/core';

import { BudgetDto } from '../../../../dtos/budget/budget-types';
import { BudgetSelection } from '../../../features/dashboard/types/dashboard.types';

@Injectable({
  providedIn: 'root',
})
export class BudgetSelectionService {
  private readonly _selectedBudget = signal<BudgetDto | null>(null);
  private readonly _availableBudgets = signal<BudgetDto[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly selectedBudget = this._selectedBudget.asReadonly();
  readonly availableBudgets = this._availableBudgets.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasSelectedBudget = computed(() => this._selectedBudget() !== null);
  readonly hasAvailableBudgets = computed(() => this._availableBudgets().length > 0);
  readonly selectedBudgetId = computed(() => this._selectedBudget()?.id ?? null);
  readonly selectedBudgetName = computed(
    () => this._selectedBudget()?.name ?? 'Nenhum orçamento selecionado'
  );

  readonly budgetSelection = computed(
    (): BudgetSelection => ({
      selectedBudgetId: this.selectedBudgetId(),
      availableBudgets: this._availableBudgets(),
      isLoading: this._isLoading(),
      error: this._error(),
    })
  );

  setSelectedBudget(budget: BudgetDto | null): void {
    this._selectedBudget.set(budget);
    this._error.set(null);
  }

  setAvailableBudgets(budgets: BudgetDto[]): void {
    this._availableBudgets.set(budgets);
    this._error.set(null);
  }

  selectBudgetById(budgetId: string): boolean {
    const budget = this._availableBudgets().find((b) => b.id === budgetId);
    if (budget) {
      this.setSelectedBudget(budget);
      return true;
    }
    return false;
  }

  clearSelection(): void {
    this._selectedBudget.set(null);
    this._error.set(null);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  clearError(): void {
    this._error.set(null);
  }

  reset(): void {
    this._selectedBudget.set(null);
    this._availableBudgets.set([]);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
