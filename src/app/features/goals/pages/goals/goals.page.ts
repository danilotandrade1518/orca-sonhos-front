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
import { GoalsState } from '../../state/goals-state/goals.state';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { OsFilterBarComponent } from '@shared/ui-components/molecules/os-filter-bar/os-filter-bar.component';
import { OsInputComponent } from '@shared/ui-components/atoms/os-input/os-input.component';
import { OsSelectComponent } from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent, type PageHeaderAction } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import type { ModalTemplateConfig } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';

@Component({
  selector: 'os-goals-page',
  imports: [
    GoalListComponent,
    OsFilterBarComponent,
    OsInputComponent,
    OsSelectComponent,
    OsPageComponent,
    OsPageHeaderComponent,
    OsAlertComponent,
    OsModalTemplateComponent,
  ],
  template: `
    <os-page variant="default" size="medium" ariaLabel="Página de metas">
      <os-page-header
        title="Metas"
        subtitle="Gerencie suas metas financeiras"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
      />

      @if (state.error()) {
      <os-alert
        type="error"
        [title]="'Erro ao carregar metas'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ state.error() }}
      </os-alert>
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

      <os-goal-list
        [goals]="filteredGoals()"
        [isLoading]="state.isLoading()"
        [lastUpdated]="state.lastUpdated()"
        [error]="state.error()"
        [progressById]="state.progressById()"
        [remainingById]="state.remainingById()"
        [suggestedById]="state.suggestedMonthlyById()"
        (create)="navigateToNew()"
        (cardClick)="navigateToDetail($event)"
        (aportar)="onAportar($event)"
        (editar)="onEditar($event)"
        (excluir)="confirmDelete($event)"
      />

      @if (showDeleteConfirmModal()) {
      <os-modal-template
        [config]="deleteModalConfig()"
        [variant]="'compact'"
        [size]="'small'"
        [disabled]="state.isLoading()"
        [loading]="state.isLoading()"
        [valid]="true"
        (actionClick)="onDeleteActionClick($event)"
        (cancelled)="onDeleteCancelled()"
        (closed)="onDeleteCancelled()"
      />
      }
    </os-page>
  `,
  styleUrl: './goals.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsPage implements OnInit {
  readonly state = inject(GoalsState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly budgetSelection = inject(BudgetSelectionService);

  private readonly _searchTerm = signal('');
  private readonly _selectedDeadlineFilter = signal<'all' | 'with-deadline' | 'without-deadline'>('all');
  private _lastBudgetId: string | null = null;

  readonly deleteGoalId = signal<string | null>(null);
  readonly deleteGoalName = signal<string | null>(null);

  readonly searchTerm = this._searchTerm.asReadonly();
  readonly selectedDeadlineFilter = this._selectedDeadlineFilter.asReadonly();

  readonly hasActiveFilters = computed(() => {
    return this._searchTerm().length > 0 || this._selectedDeadlineFilter() !== 'all';
  });

  readonly showDeleteConfirmModal = computed(() => {
    return this.deleteGoalId() !== null;
  });

  readonly deleteModalConfig = computed<ModalTemplateConfig>(() => {
    const goalName = this.deleteGoalName();
    return {
      title: 'Excluir Meta',
      subtitle: goalName
        ? `Tem certeza que deseja excluir a meta "${goalName}"? Esta ação não pode ser desfeita.`
        : 'Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.',
      showActions: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cancelar',
      actions: [
        {
          label: 'Excluir',
          variant: 'danger',
          size: 'medium',
          disabled: this.state.isLoading(),
          loading: this.state.isLoading(),
        },
      ],
    };
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

  readonly pageHeaderActions = computed<PageHeaderAction[]>(() => {
    return [
      {
        label: 'Nova Meta',
        icon: 'plus',
        variant: 'primary',
        size: 'medium',
      },
    ];
  });

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Nova Meta') {
      this.navigateToNew();
    }
  }

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
    this.router.navigate([goalId, 'add-amount'], { relativeTo: this.route });
  }

  navigateToDetail(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  onEditar(goalId: string): void {
    this.router.navigate([goalId, 'edit'], { relativeTo: this.route });
  }

  confirmDelete(goalId: string): void {
    const goals = this.state.items();
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    this.deleteGoalId.set(goalId);
    this.deleteGoalName.set(goal.name);
  }

  onDeleteActionClick(action: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }): void {
    if (action.variant === 'danger' || action.label === 'Excluir') {
      this.onDeleteConfirmed();
    }
  }

  onDeleteConfirmed(): void {
    const goalId = this.deleteGoalId();
    if (!goalId) {
      this.onDeleteCancelled();
      return;
    }

    this.state.delete({ id: goalId });
    this.onDeleteCancelled();
  }

  onDeleteCancelled(): void {
    this.deleteGoalId.set(null);
    this.deleteGoalName.set(null);
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

  }
}
