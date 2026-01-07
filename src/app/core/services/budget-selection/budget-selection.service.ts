import { computed, Injectable, signal } from '@angular/core';

import { BudgetDto } from '../../../../dtos/budget/budget-types';
import { BudgetSelection } from '../../../features/dashboard/types/dashboard.types';

const SELECTED_BUDGET_ID_KEY = 'orca-sonhos-selected-budget-id';

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
    
    if (budget) {
      this.saveSelectedBudgetId(budget.id);
    } else {
      this.clearSelectedBudgetId();
    }
  }

  setAvailableBudgets(budgets: BudgetDto[]): void {
    this._availableBudgets.set(budgets);
    this._error.set(null);
    
    if (budgets.length > 0 && !this._selectedBudget()) {
      this.restoreSelectedBudgetFromStorage(budgets);
    }
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
    this.clearSelectedBudgetId();
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
    this.clearSelectedBudgetId();
  }
  
  private saveSelectedBudgetId(budgetId: string): void {
    try {
      localStorage.setItem(SELECTED_BUDGET_ID_KEY, budgetId);
    } catch (error) {
      console.warn('Erro ao salvar budget selecionado no localStorage:', error);
    }
  }
  
  private clearSelectedBudgetId(): void {
    try {
      localStorage.removeItem(SELECTED_BUDGET_ID_KEY);
    } catch (error) {
      console.warn('Erro ao remover budget selecionado do localStorage:', error);
    }
  }
  
  private getSelectedBudgetIdFromStorage(): string | null {
    try {
      return localStorage.getItem(SELECTED_BUDGET_ID_KEY);
    } catch (error) {
      console.warn('Erro ao recuperar budget selecionado do localStorage:', error);
      return null;
    }
  }
  
  private restoreSelectedBudgetFromStorage(budgets: BudgetDto[]): void {
    const savedBudgetId = this.getSelectedBudgetIdFromStorage();
    
    if (savedBudgetId) {
      const savedBudget = budgets.find((b) => b.id === savedBudgetId);
      if (savedBudget) {
        
        this.setSelectedBudget(savedBudget);
        return;
      } else {
        
        this.clearSelectedBudgetId();
      }
    }
    
    if (budgets.length > 0) {
      
      this.setSelectedBudget(budgets[0]);
    }
  }
}
