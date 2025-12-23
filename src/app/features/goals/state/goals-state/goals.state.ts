import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import type {
  AddAmountToGoalDto,
  CreateGoalDto,
  DeleteGoalDto,
  GoalDto,
  RemoveAmountFromGoalDto,
  UpdateGoalDto,
} from '../../../../../dtos/goal';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { GoalsApiService } from '../../services/goals-api/goals-api.service';

@Injectable({
  providedIn: 'root',
})
export class GoalsState {
  private readonly goalsApi = inject(GoalsApiService);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _items = signal<GoalDto[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _lastUpdated = signal<Date | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly lastUpdated = this._lastUpdated.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasItems = computed(() => this._items().length > 0);
  readonly itemsCount = computed(() => this._items().length);

  readonly progressById = computed(() => {
    const goals = this._items();
    const progressMap = new Map<string, number>();

    goals.forEach((goal) => {
      if (!goal.id) return;
      
      const totalAmount = typeof goal.totalAmount === 'number' && !isNaN(goal.totalAmount) ? goal.totalAmount : 0;
      const accumulatedAmount = typeof goal.accumulatedAmount === 'number' && !isNaN(goal.accumulatedAmount) ? goal.accumulatedAmount : 0;
      
      if (totalAmount <= 0) {
        progressMap.set(goal.id, 0);
        return;
      }
      const progress = (accumulatedAmount / totalAmount) * 100;
      progressMap.set(goal.id, Math.min(Math.max(progress, 0), 100));
    });

    return (id: string) => progressMap.get(id) ?? 0;
  });

  readonly remainingById = computed(() => {
    const goals = this._items();
    const remainingMap = new Map<string, number>();

    goals.forEach((goal) => {
      if (!goal.id) return;
      
      const totalAmount = typeof goal.totalAmount === 'number' && !isNaN(goal.totalAmount) ? goal.totalAmount : 0;
      const accumulatedAmount = typeof goal.accumulatedAmount === 'number' && !isNaN(goal.accumulatedAmount) ? goal.accumulatedAmount : 0;
      
      const remaining = Math.max(totalAmount - accumulatedAmount, 0);
      remainingMap.set(goal.id, remaining);
    });

    return (id: string) => remainingMap.get(id) ?? 0;
  });

  readonly suggestedMonthlyById = computed(() => {
    const goals = this._items();
    const suggestedMap = new Map<string, number | null>();

    goals.forEach((goal) => {
      if (!goal.id) return; 
      if (!goal.deadline) {
        suggestedMap.set(goal.id, null);
        return;
      }

      const dueDate = new Date(goal.deadline);
      const now = new Date();

      if (dueDate <= now) {
        suggestedMap.set(goal.id, null);
        return;
      }

      const monthsRemaining = this.calculateMonthsRemaining(now, dueDate);

      if (monthsRemaining <= 0) {
        suggestedMap.set(goal.id, null);
        return;
      }

      const totalAmount = typeof goal.totalAmount === 'number' && !isNaN(goal.totalAmount) ? goal.totalAmount : 0;
      const accumulatedAmount = typeof goal.accumulatedAmount === 'number' && !isNaN(goal.accumulatedAmount) ? goal.accumulatedAmount : 0;
      
      const remaining = Math.max(totalAmount - accumulatedAmount, 0);
      const suggested = remaining / monthsRemaining;
      suggestedMap.set(goal.id, Math.round(suggested * 100) / 100);
    });

    return (id: string) => suggestedMap.get(id) ?? null;
  });

  load(budgetId?: string): void {
    
    if (this._isLoading()) {
      return;
    }

    const targetBudgetId = budgetId ?? this.budgetSelection.selectedBudgetId();

    if (!targetBudgetId) {
      this._error.set('Nenhum orçamento selecionado');
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);

    this.goalsApi
      .listByBudget(targetBudgetId)
      .pipe(
        map((response) => response.data),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (goals) => {
          
          const validGoals = goals
            .filter((goal) => {
              if (!goal.id) {
                console.warn('Goal sem ID encontrado:', goal);
                return false;
              }
              return true;
            })
            .map((goal) => ({
              ...goal,
              totalAmount: this.safeNumber(goal.totalAmount, 0),
              accumulatedAmount: this.safeNumber(goal.accumulatedAmount, 0),
            }));
          
          this._items.set(validGoals);
          this._lastUpdated.set(new Date());
          this._isLoading.set(false);
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao carregar metas');
          this._isLoading.set(false);
          console.error('Erro ao carregar metas:', error);
        },
      });
  }

  create(dto: CreateGoalDto): void {
    this._error.set(null);

    this.goalsApi
      .create(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.data?.id) {
            this.notificationService.showSuccess('Meta criada com sucesso');
            const budgetId = dto.budgetId ?? this.budgetSelection.selectedBudgetId();
            if (budgetId) {
              this.load(budgetId);
            }
          } else {
            const errorMsg = 'Erro ao criar meta';
            this._error.set(errorMsg);
            this.notificationService.showError(errorMsg);
          }
        },
        error: (error) => {
          const errorMsg = error?.message || 'Erro ao criar meta';
          this._error.set(errorMsg);
          this.notificationService.showError(errorMsg);
        },
      });
  }

  update(dto: UpdateGoalDto): void {
    this._error.set(null);

    this.goalsApi
      .update(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.data?.success) {
            this.notificationService.showSuccess('Meta atualizada com sucesso');
            const budgetId = this.budgetSelection.selectedBudgetId();
            if (budgetId) {
              this.load(budgetId);
            }
          } else {
            const errorMsg = 'Erro ao atualizar meta';
            this._error.set(errorMsg);
            this.notificationService.showError(errorMsg);
          }
        },
        error: (error) => {
          const errorMsg = error?.message || 'Erro ao atualizar meta';
          this._error.set(errorMsg);
          this.notificationService.showError(errorMsg);
        },
      });
  }

  delete(dto: DeleteGoalDto): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.goalsApi
      .delete(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.data?.success) {
            this.notificationService.showSuccess('Meta excluída com sucesso');
            this._items.update((items) => items.filter((item) => item.id !== dto.id));
            this._lastUpdated.set(new Date());
            this._isLoading.set(false);
          } else {
            const errorMsg = 'Erro ao excluir meta';
            this._error.set(errorMsg);
            this.notificationService.showError(errorMsg);
            this._isLoading.set(false);
          }
        },
        error: (error) => {
          const errorMsg = error?.message || 'Erro ao excluir meta';
          this._error.set(errorMsg);
          this.notificationService.showError(errorMsg);
          this._isLoading.set(false);
        },
      });
  }

  addAmount(dto: AddAmountToGoalDto): void {
    if (dto.amount <= 0) {
      const errorMsg = 'O valor do aporte deve ser positivo';
      this._error.set(errorMsg);
      this.notificationService.showError(errorMsg);
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);

    this.goalsApi
      .addAmount(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.data?.success) {
            this.notificationService.showSuccess('Aporte adicionado com sucesso');
            this._items.update((items) => {
              return items.map((item) => {
                if (item.id === dto.id) {
                  const newAmount = item.accumulatedAmount + dto.amount;
                  return { ...item, accumulatedAmount: Math.max(newAmount, 0) };
                }
                return item;
              });
            });
            this._lastUpdated.set(new Date());
            this._isLoading.set(false);
          } else {
            const errorMsg = 'Erro ao adicionar aporte';
            this._error.set(errorMsg);
            this.notificationService.showError(errorMsg);
            this._isLoading.set(false);
          }
        },
        error: (error) => {
          const errorMsg = error?.message || 'Erro ao adicionar aporte';
          this._error.set(errorMsg);
          this.notificationService.showError(errorMsg);
          this._isLoading.set(false);
        },
      });
  }

  removeAmount(dto: RemoveAmountFromGoalDto): void {
    if (dto.amount <= 0) {
      const errorMsg = 'O valor a remover deve ser positivo';
      this._error.set(errorMsg);
      this.notificationService.showError(errorMsg);
      return;
    }

    const goal = this._items().find((item) => item.id === dto.id);
    if (!goal) {
      const errorMsg = 'Meta não encontrada';
      this._error.set(errorMsg);
      this.notificationService.showError(errorMsg);
      return;
    }

    const newAmount = goal.accumulatedAmount - dto.amount;
    if (newAmount < 0) {
      const errorMsg = 'Não é possível remover valor que resulte em saldo negativo';
      this._error.set(errorMsg);
      this.notificationService.showError(errorMsg);
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);

    this.goalsApi
      .removeAmount(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.data?.success) {
            this.notificationService.showSuccess('Aporte removido com sucesso');
            this._items.update((items) => {
              return items.map((item) => {
                if (item.id === dto.id) {
                  return { ...item, accumulatedAmount: Math.max(item.accumulatedAmount - dto.amount, 0) };
                }
                return item;
              });
            });
            this._lastUpdated.set(new Date());
            this._isLoading.set(false);
          } else {
            const errorMsg = 'Erro ao remover aporte';
            this._error.set(errorMsg);
            this.notificationService.showError(errorMsg);
            this._isLoading.set(false);
          }
        },
        error: (error) => {
          const errorMsg = error?.message || 'Erro ao remover aporte';
          this._error.set(errorMsg);
          this.notificationService.showError(errorMsg);
          this._isLoading.set(false);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }

  refresh(): void {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (budgetId) {
      this.load(budgetId);
    }
  }

  private calculateMonthsRemaining(start: Date, end: Date): number {
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const dayDiff = end.getDate() - start.getDate();

    let months = yearDiff * 12 + monthDiff;

    if (dayDiff < 0) {
      months -= 1;
    }

    return Math.max(months, 0);
  }

  private safeNumber(value: unknown, defaultValue: number = 0): number {
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (!isNaN(parsed) && isFinite(parsed)) {
        return parsed;
      }
    }
    return defaultValue;
  }
}
