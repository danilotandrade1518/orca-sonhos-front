import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';

import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { WidgetConfiguration } from '../../types/dashboard.types';
import {
  OsDashboardWidgetsComponent,
  DashboardState,
  DashboardWidget,
  GoalProgressData,
} from '../../../../shared/ui-components/organisms/os-dashboard-widgets/os-dashboard-widgets.component';
import { GoalDto } from '@dtos/goal';
import { AccountState } from '../../../../core/services/account/account-state/account.state';
import { AccountDto } from '@dtos/account';
import { AccountBalanceData } from '../../../../shared/ui-components/organisms/os-dashboard-widgets/os-dashboard-widgets.component';

@Component({
  selector: 'os-dashboard-widgets-container',
  standalone: true,
  imports: [CommonModule, OsDashboardWidgetsComponent],
  template: `
    <os-dashboard-widgets
      [widgets]="getDashboardWidgets()"
      [variant]="variant()"
      [size]="size()"
      [state]="dashboardState()"
      [showCreateActions]="showCreateActions()"
      [errorMessage]="errorMessage()"
      [emptyMessage]="emptyMessage()"
      (widgetClick)="onWidgetClick($event)"
      (retryRequested)="onRetryRequested()"
      (createBudgetRequested)="onCreateBudgetRequested()"
      (createGoalRequested)="onCreateGoalRequested()"
      (addTransactionRequested)="onAddTransactionRequested()"
      (viewReportsRequested)="onViewReportsRequested()"
      (goalCardClick)="onGoalCardClick($event)"
      (goalCardExpand)="onGoalCardExpand($event)"
      class="os-dashboard-widgets"
    />
  `,
  styleUrls: ['./dashboard-widgets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWidgetsComponent {
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly dashboardDataService = inject(DashboardDataService);
  private readonly accountState = inject(AccountState);

  readonly widgets = input<WidgetConfiguration[]>([]);
  readonly variant = input<'default' | 'compact' | 'extended'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly showCreateActions = input<boolean>(true);
  readonly emptyMessage = input<string>('Nenhum dado disponível para exibir');

  readonly widgetClick = output<WidgetConfiguration>();
  readonly retryRequested = output<void>();
  readonly createBudgetRequested = output<void>();
  readonly createGoalRequested = output<void>();
  readonly addTransactionRequested = output<void>();
  readonly viewReportsRequested = output<void>();
  readonly goalCardClick = output<unknown>();
  readonly goalCardExpand = output<unknown>();

  readonly selectedBudget = computed(() => this.budgetSelectionService.selectedBudget());
  readonly hasSelectedBudget = computed(() => this.budgetSelectionService.hasSelectedBudget());
  readonly budgetOverview = computed(() => this.dashboardDataService.budgetOverview());
  readonly goals = computed(() => this.dashboardDataService.goals());
  readonly isLoading = computed(() => this.dashboardDataService.isLoading());
  readonly hasError = computed(() => !!this.dashboardDataService.error());
  readonly errorMessage = computed(
    () => this.dashboardDataService.error() || 'Erro ao carregar dados do dashboard'
  );
  readonly accounts = computed(() => this.accountState.accountsByBudgetId());
  readonly accountsLoading = computed(() => this.accountState.loading());
  readonly accountsError = computed(() => this.accountState.error());

  constructor() {
    effect(() => {
      const budgetId = this.budgetSelectionService.selectedBudgetId();
      if (budgetId && this.hasAccountBalanceWidget()) {
        this.accountState.loadAccounts();
      }
    });
  }

  private hasAccountBalanceWidget(): boolean {
    return this.widgets().some((widget) => widget.type === 'account-balance' && widget.enabled);
  }

  readonly dashboardWidgets = computed(() => {
    return this.widgets().map((widget) => {
      const dashboardWidget: DashboardWidget = {
        id: widget.id,
        type: widget.type,
        title: widget.title,
        size: widget.size,
        position: widget.position,
        enabled: widget.enabled,
      };

      if (widget.type === 'goal-progress') {
        const firstGoal = this.getFirstGoal();
        if (firstGoal) {
          dashboardWidget.data = this.convertGoalToProgressData(firstGoal);
        }
      }

      if (widget.type === 'account-balance') {
        const accounts = this.accounts();
        if (accounts.length > 0) {
          dashboardWidget.data = this.convertAccountsToBalanceData(accounts);
        }
      }

      return dashboardWidget;
    });
  });

  private getFirstGoal(): GoalDto | null {
    const goals = this.goals();
    return goals.length > 0 ? goals[0] : null;
  }

  private convertGoalToProgressData(goal: GoalDto): GoalProgressData {
    const deadline = goal.deadline ? new Date(goal.deadline) : undefined;
    const progressPercentage =
      goal.totalAmount > 0 ? Math.min((goal.accumulatedAmount / goal.totalAmount) * 100, 100) : 0;

    let priority: 'low' | 'medium' | 'high' = 'medium';
    if (deadline) {
      const daysUntilDeadline = Math.ceil(
        (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDeadline < 30 && progressPercentage < 50) {
        priority = 'high';
      } else if (daysUntilDeadline < 90 && progressPercentage < 75) {
        priority = 'medium';
      } else {
        priority = 'low';
      }
    }

    return {
      id: goal.id,
      title: goal.name,
      currentValue: goal.accumulatedAmount,
      targetValue: goal.totalAmount,
      unit: 'BRL',
      deadline,
      priority,
    };
  }

  private convertAccountsToBalanceData(accounts: AccountDto[]): AccountBalanceData[] {
    return accounts.map((account) => {
      let type: 'checking' | 'savings' | 'investment' = 'checking';
      if (account.type === 'SAVINGS_ACCOUNT') {
        type = 'savings';
      } else if (account.type === 'INVESTMENT_ACCOUNT') {
        type = 'investment';
      }

      return {
        accountName: account.name,
        balance: account.balance,
        type,
        lastUpdated: new Date(),
      };
    });
  }

  readonly dashboardState = computed((): DashboardState => {
    if (this.isLoading()) return 'loading';
    if (this.hasError()) return 'error';
    if (!this.hasSelectedBudget()) return 'empty';
    return 'success';
  });

  readonly gridClass = computed(() => {
    const classes = ['os-dashboard-widgets__grid'];

    if (this.variant() === 'compact') {
      classes.push('os-dashboard-widgets__grid--compact');
    } else if (this.variant() === 'extended') {
      classes.push('os-dashboard-widgets__grid--extended');
    }

    return classes.join(' ');
  });

  widgetClass(widget: WidgetConfiguration): string {
    const classes = ['os-dashboard-widgets__widget'];
    classes.push(`os-dashboard-widgets__widget--${widget.size}`);
    classes.push(`os-dashboard-widgets__widget--${widget.type}`);

    return classes.join(' ');
  }

  getWidgetGridColumn(widget: WidgetConfiguration): string {
    const sizeMap = {
      small: 'span 3',
      medium: 'span 6',
      large: 'span 9',
      'full-width': 'span 12',
    };

    return sizeMap[widget.size] || 'span 6';
  }

  getWidgetGridRow(widget: WidgetConfiguration): string {
    return `row ${widget.position.row}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  onRetry(): void {
    this.retryRequested.emit();
  }

  onWidgetClick(widget: WidgetConfiguration): void {
    this.widgetClick.emit(widget);
  }

  onWidgetKeyDown(event: KeyboardEvent, widget: WidgetConfiguration): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onWidgetClick(widget);
        break;
      case 'Tab':
        break;
      default:
        break;
    }
  }

  getWidgetAriaLabel(widget: WidgetConfiguration): string {
    return `${widget.title} widget`;
  }

  getWidgetDescriptionId(widget: WidgetConfiguration): string {
    return `widget-${widget.id}-description`;
  }

  onRetryRequested(): void {
    this.retryRequested.emit();
  }

  onCreateBudgetRequested(): void {
    this.createBudgetRequested.emit();
  }

  onCreateGoalRequested(): void {
    this.createGoalRequested.emit();
  }

  onAddTransactionRequested(): void {
    this.addTransactionRequested.emit();
  }

  onViewReportsRequested(): void {
    this.viewReportsRequested.emit();
  }

  onGoalCardClick(data: unknown): void {
    this.goalCardClick.emit(data);
  }

  onGoalCardExpand(data: unknown): void {
    this.goalCardExpand.emit(data);
  }

  getDashboardWidgets() {
    return this.dashboardWidgets();
  }
}
