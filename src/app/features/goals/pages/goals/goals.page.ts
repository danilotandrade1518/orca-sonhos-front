import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  OnInit,
  untracked,
} from '@angular/core';
import { GoalListComponent } from '../../components/goal-list/goal-list.component';
import { GoalAmountModalComponent } from '../../components/goal-amount-modal/goal-amount-modal.component';
import { GoalsState } from '../../state/goals-state/goals.state';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { OsFilterBarComponent } from '@shared/ui-components/molecules/os-filter-bar/os-filter-bar.component';
import { OsInputComponent } from '@shared/ui-components/atoms/os-input/os-input.component';
import { OsSelectComponent } from '@shared/ui-components/atoms/os-select/os-select.component';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';

@Component({
  selector: 'os-goals-page',
  imports: [
    CommonModule,
    GoalListComponent,
    GoalAmountModalComponent,
    OsFilterBarComponent,
    OsInputComponent,
    OsSelectComponent,
  ],
  template: `
    <section class="os-goals" role="main" aria-label="Página de metas">
      <a href="#main-content" class="os-goals__skip-link">Pular para conteúdo principal</a>

      <header class="os-goals__header">
        <h1>Metas</h1>
        <div class="os-goals__actions">
          <button
            type="button"
            (click)="navigateToNew()"
            aria-label="Criar nova meta"
          >
            Nova Meta
          </button>
        </div>
      </header>

      <div
        class="os-goals__live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        [attr.aria-label]="state.isLoading() ? 'Carregando metas' : ''"
      >
        {{ state.isLoading() ? 'Carregando metas...' : '' }}
      </div>
      @if (state.error()) {
      <div
        class="os-goals__live-region os-goals__live-region--error"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        {{ state.error() }}
      </div>
      }

      <os-filter-bar
        variant="default"
        size="medium"
        [hasActiveFilters]="hasActiveFilters()"
        [ariaLabel]="'Filtros de metas'"
        (clear)="onClearFilters()"
        (apply)="onApplyFilters()"
      >
        <div class="os-goals__filters-content">
          <os-input
            type="text"
            label="Buscar"
            placeholder="Buscar metas..."
            [value]="searchTerm()"
            size="medium"
            [ariaLabel]="'Buscar metas por nome'"
            (valueChange)="onSearchChange($event)"
          />

          <os-select
            label="Prazo"
            [options]="deadlineOptions()"
            [value]="selectedDeadlineFilter()"
            size="medium"
            [ariaLabel]="'Filtrar metas por prazo'"
            (valueChange)="onDeadlineFilterChange($event)"
          />
        </div>
      </os-filter-bar>

      <div id="main-content" tabindex="-1">
        <os-goal-list
          [goals]="filteredGoals()"
          [isLoading]="state.isLoading()"
          [lastUpdated]="state.lastUpdated()"
          [error]="state.error()"
          [progressById]="state.progressById()"
          [remainingById]="state.remainingById()"
          [suggestedById]="state.suggestedMonthlyById()"
          (create)="navigateToNew()"
          (aportar)="onAportar($event)"
          (editar)="onEditar($event)"
          (excluir)="onExcluir($event)"
        />
      </div>

      @if (showAddModal()) {
      <os-goal-amount-modal
        [mode]="'add'"
        [goalId]="selectedGoalId()!"
        [currentAmount]="selectedGoal()?.accumulatedAmount ?? 0"
        [submitting]="state.isLoading()"
        [error]="state.error()"
        (save)="onAddAmount($event)"
        (cancelled)="closeAddModal()"
      />
      } @if (showRemoveModal()) {
      <os-goal-amount-modal
        [mode]="'remove'"
        [goalId]="selectedGoalId()!"
        [currentAmount]="selectedGoal()?.accumulatedAmount ?? 0"
        [submitting]="state.isLoading()"
        [error]="state.error()"
        (save)="onRemoveAmount($event)"
        (cancelled)="closeRemoveModal()"
      />
      }
    </section>
  `,
  styleUrl: './goals.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsPage implements OnInit {
  readonly state = inject(GoalsState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly budgetSelection = inject(BudgetSelectionService);

  private readonly _showAddModal = signal(false);
  private readonly _showRemoveModal = signal(false);
  private readonly _selectedGoalId = signal<string | null>(null);
  private readonly _searchTerm = signal('');
  private readonly _selectedDeadlineFilter = signal<'all' | 'with-deadline' | 'without-deadline'>('all');
  private _lastBudgetId: string | null = null;

  readonly showAddModal = this._showAddModal.asReadonly();
  readonly showRemoveModal = this._showRemoveModal.asReadonly();
  readonly selectedGoalId = this._selectedGoalId.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly selectedDeadlineFilter = this._selectedDeadlineFilter.asReadonly();

  readonly selectedGoal = computed(() => {
    const id = this._selectedGoalId();
    if (!id) return null;
    return this.state.items().find((g) => g.id === id) || null;
  });

  readonly hasActiveFilters = computed(() => {
    return this._searchTerm().length > 0 || this._selectedDeadlineFilter() !== 'all';
  });

  readonly deadlineOptions = computed(() => [
    { value: 'all', label: 'Todas' },
    { value: 'with-deadline', label: 'Com prazo' },
    { value: 'without-deadline', label: 'Sem prazo' },
  ]);

  readonly filteredGoals = computed(() => {
    const goals = this.state.items();
    const search = this._searchTerm().toLowerCase();
    const deadlineFilter = this._selectedDeadlineFilter();

    return goals.filter((goal: GoalDto) => {
      const matchesSearch = goal.name.toLowerCase().includes(search);
      const matchesDeadline =
        deadlineFilter === 'all' ||
        (deadlineFilter === 'with-deadline' && goal.deadline !== null) ||
        (deadlineFilter === 'without-deadline' && goal.deadline === null);
      return matchesSearch && matchesDeadline;
    });
  });

  constructor() {
    effect(() => {
      const budgetId = this.budgetSelection.selectedBudgetId();
      
      if (budgetId === this._lastBudgetId || this.state.isLoading()) {
        return;
      }
      
      untracked(() => {
        if (budgetId) {
          this._lastBudgetId = budgetId;
          this.state.load(budgetId);
        } else {
          this._lastBudgetId = null;
        }
      });
    });
  }

  ngOnInit(): void {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (budgetId) {
      this.state.load(budgetId);
    }
  }

  navigateToNew(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onAportar(goalId: string): void {
    this._selectedGoalId.set(goalId);
    this._showAddModal.set(true);
  }

  onEditar(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  onExcluir(goalId: string): void {
    this.state.delete({ id: goalId });
  }

  onAddAmount(event: { goalId: string; amount: number }): void {
    this.state.addAmount({ id: event.goalId, amount: event.amount });
    this.closeAddModal();
  }

  onRemoveAmount(event: { goalId: string; amount: number }): void {
    this.state.removeAmount({ id: event.goalId, amount: event.amount });
    this.closeRemoveModal();
  }

  closeAddModal(): void {
    this._showAddModal.set(false);
    this._selectedGoalId.set(null);
  }

  closeRemoveModal(): void {
    this._showRemoveModal.set(false);
    this._selectedGoalId.set(null);
  }

  onSearchChange(value: string): void {
    this._searchTerm.set(value);
  }

  onDeadlineFilterChange(value: string | number): void {
    this._selectedDeadlineFilter.set(value as 'all' | 'with-deadline' | 'without-deadline');
  }

  onClearFilters(): void {
    this._searchTerm.set('');
    this._selectedDeadlineFilter.set('all');
  }

  onApplyFilters(): void {
    // Filtros são aplicados automaticamente via computed filteredGoals
    // Este método pode ser usado para ações adicionais se necessário
  }
}
