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
    OsAlertComponent
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
        (aportar)="onAportar($event)"
        (editar)="onEditar($event)"
        (excluir)="onExcluir($event)"
      />
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

  readonly searchTerm = this._searchTerm.asReadonly();
  readonly selectedDeadlineFilter = this._selectedDeadlineFilter.asReadonly();

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

  onEditar(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  onExcluir(goalId: string): void {
    this.state.delete({ id: goalId });
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
