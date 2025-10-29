import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BudgetDto } from '../../../../dtos/budget';
import { BudgetSelectionService } from '../budget-selection/budget-selection.service';
import { BudgetService } from './budget.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetState {
  private readonly budgetService = inject(BudgetService);
  private readonly budgetSelectionService = inject(BudgetSelectionService);

  private readonly _budgets = signal<BudgetDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly budgets = this._budgets.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasBudgets = computed(() => this._budgets().length > 0);
  readonly budgetsCount = computed(() => this._budgets().length);

  readonly selectedBudget = this.budgetSelectionService.selectedBudget;
  readonly selectedBudgetId = this.budgetSelectionService.selectedBudgetId;

  loadBudgets(): void {
    this._loading.set(true);
    this._error.set(null);

    this.budgetService
      .getBudgets()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (budgets) => {
          this._budgets.set(budgets);
          this._loading.set(false);

          this.budgetSelectionService.setAvailableBudgets(budgets);

          if (budgets.length > 0 && !this.selectedBudget()) {
            this.selectFirstBudget();
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Failed to load budgets');
          this._loading.set(false);
        },
      });
  }

  selectBudget(budgetId: string): void {
    const budget = this._budgets().find((b) => b.id === budgetId);
    if (budget) {
      this.budgetSelectionService.setSelectedBudget(budget);
    }
  }

  selectFirstBudget(): void {
    const budgets = this._budgets();
    if (budgets.length > 0) {
      this.budgetSelectionService.setSelectedBudget(budgets[0]);
    }
  }

  createBudget(name: string, type: 'PERSONAL' | 'SHARED', ownerId: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.budgetService
      .createBudget({ name, type, ownerId })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (budgetId) => {
          if (budgetId) {
            this.loadBudgets();
          } else {
            this._error.set('Failed to create budget');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Failed to create budget');
          this._loading.set(false);
        },
      });
  }

  updateBudget(userId: string, budgetId: string, name: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.budgetService
      .updateBudget({ userId, budgetId, name })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadBudgets();
          } else {
            this._error.set('Failed to update budget');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Failed to update budget');
          this._loading.set(false);
        },
      });
  }

  deleteBudget(userId: string, budgetId: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.budgetService
      .deleteBudget({ userId, budgetId })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (success) => {
          if (success) {
            const wasSelected = this.selectedBudgetId() === budgetId;

            this.loadBudgets();

            if (wasSelected) {
              setTimeout(() => {
                this.selectFirstBudget();
              }, 100);
            }
          } else {
            this._error.set('Failed to delete budget');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Failed to delete budget');
          this._loading.set(false);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }

  refreshBudgets(): void {
    this.loadBudgets();
  }
}
