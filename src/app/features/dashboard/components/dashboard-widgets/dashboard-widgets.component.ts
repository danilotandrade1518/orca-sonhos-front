import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { WidgetConfiguration } from '../../types/dashboard.types';
import {
  OsDashboardWidgetsComponent,
  DashboardState,
} from '../../../../shared/ui-components/organisms/os-dashboard-widgets/os-dashboard-widgets.component';

@Component({
  selector: 'os-dashboard-widgets',
  standalone: true,
  imports: [CommonModule, OsDashboardWidgetsComponent],
  template: `
    <os-dashboard-widgets
      [widgets]="getDashboardWidgets()"
      [variant]="variant()"
      [size]="size()"
      [state]="dashboardState()"
      [showWidgetActions]="showWidgetActions()"
      [showCreateActions]="showCreateActions()"
      [errorMessage]="errorMessage()"
      [emptyMessage]="emptyMessage()"
      (widgetClick)="onWidgetClick($event)"
      (widgetConfigure)="onWidgetConfigure($event)"
      (widgetClose)="onWidgetClose($event)"
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

  // Inputs
  readonly widgets = input<WidgetConfiguration[]>([]);
  readonly variant = input<'default' | 'compact' | 'extended'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly showWidgetActions = input<boolean>(true);
  readonly showCreateActions = input<boolean>(true);
  readonly emptyMessage = input<string>('Nenhum dado disponível para exibir');

  // Outputs
  readonly widgetClick = output<WidgetConfiguration>();
  readonly widgetConfigure = output<WidgetConfiguration>();
  readonly widgetClose = output<WidgetConfiguration>();
  readonly retryRequested = output<void>();
  readonly createBudgetRequested = output<void>();
  readonly createGoalRequested = output<void>();
  readonly addTransactionRequested = output<void>();
  readonly viewReportsRequested = output<void>();
  readonly goalCardClick = output<unknown>();
  readonly goalCardExpand = output<unknown>();

  // Computed properties
  readonly selectedBudget = computed(() => this.budgetSelectionService.selectedBudget());
  readonly hasSelectedBudget = computed(() => this.budgetSelectionService.hasSelectedBudget());
  readonly budgetOverview = computed(() => this.dashboardDataService.budgetOverview());
  readonly isLoading = computed(() => this.dashboardDataService.isLoading());
  readonly hasError = computed(() => !!this.dashboardDataService.error());
  readonly errorMessage = computed(
    () => this.dashboardDataService.error() || 'Erro ao carregar dados do dashboard'
  );

  readonly dashboardWidgets = computed(() => {
    return this.widgets().map((widget) => ({
      id: widget.id,
      type: widget.type,
      title: widget.title,
      size: widget.size,
      position: widget.position,
      enabled: widget.enabled,
    }));
  });

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
        // Allow default tab behavior
        break;
      default:
        // Handle other keys if needed
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

  onWidgetConfigure(widget: WidgetConfiguration): void {
    this.widgetConfigure.emit(widget);
  }

  onWidgetClose(widget: WidgetConfiguration): void {
    this.widgetClose.emit(widget);
  }
}
