import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { WidgetConfiguration } from '../../types/dashboard.types';

@Component({
  selector: 'os-dashboard-widgets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="os-dashboard-widgets" [class]="containerClass()">
      @if (isLoading()) {
      <div class="os-dashboard-widgets__loading">
        <div class="os-dashboard-widgets__spinner"></div>
        <p>Carregando dados do dashboard...</p>
      </div>
      } @else if (hasError()) {
      <div class="os-dashboard-widgets__error">
        <div class="os-dashboard-widgets__error-icon">⚠️</div>
        <h3>Erro ao carregar dados</h3>
        <p>{{ errorMessage() }}</p>
        <button class="os-dashboard-widgets__retry-button" (click)="onRetry()">
          Tentar Novamente
        </button>
      </div>
      } @else if (!hasSelectedBudget()) {
      <div class="os-dashboard-widgets__empty">
        <div class="os-dashboard-widgets__empty-icon">📊</div>
        <h3>Nenhum orçamento selecionado</h3>
        <p>Selecione um orçamento para visualizar os dados do dashboard.</p>
      </div>
      } @else {
      <div class="os-dashboard-widgets__grid" [class]="gridClass()">
        @for (widget of widgets(); track widget.id) {
        <div
          class="os-dashboard-widgets__widget"
          [class]="widgetClass(widget)"
          [style.grid-column]="getWidgetGridColumn(widget)"
          [style.grid-row]="getWidgetGridRow(widget)"
          [attr.aria-label]="widget.title"
        >
          <div class="os-dashboard-widgets__widget-header">
            <h4 class="os-dashboard-widgets__widget-title">{{ widget.title }}</h4>
          </div>

          <div class="os-dashboard-widgets__widget-content">
            @switch (widget.type) { @case ('budget-summary') {
            <div class="os-dashboard-widgets__budget-summary">
              <div class="os-dashboard-widgets__metric">
                <span class="os-dashboard-widgets__metric-label">Total</span>
                <span class="os-dashboard-widgets__metric-value">
                  {{ formatCurrency(budgetOverview()?.totals?.accountsBalance || 0) }}
                </span>
              </div>
              <div class="os-dashboard-widgets__metric">
                <span class="os-dashboard-widgets__metric-label">Receita Mensal</span>
                <span class="os-dashboard-widgets__metric-value">
                  {{ formatCurrency(budgetOverview()?.totals?.monthIncome || 0) }}
                </span>
              </div>
              <div class="os-dashboard-widgets__metric">
                <span class="os-dashboard-widgets__metric-label">Despesa Mensal</span>
                <span class="os-dashboard-widgets__metric-value">
                  {{ formatCurrency(budgetOverview()?.totals?.monthExpense || 0) }}
                </span>
              </div>
            </div>
            } @case ('goal-progress') {
            <div class="os-dashboard-widgets__goal-progress">
              <p>Progresso das metas será exibido aqui</p>
            </div>
            } @case ('transaction-list') {
            <div class="os-dashboard-widgets__transaction-list">
              <p>Lista de transações será exibida aqui</p>
            </div>
            } @case ('account-balance') {
            <div class="os-dashboard-widgets__account-balance">
              <p>Saldo das contas será exibido aqui</p>
            </div>
            } @case ('monthly-trends') {
            <div class="os-dashboard-widgets__monthly-trends">
              <p>Tendências mensais serão exibidas aqui</p>
            </div>
            } @case ('quick-actions') {
            <div class="os-dashboard-widgets__quick-actions">
              <p>Ações rápidas serão exibidas aqui</p>
            </div>
            } @default {
            <div class="os-dashboard-widgets__placeholder">
              <p>Widget não implementado: {{ widget.type }}</p>
            </div>
            } }
          </div>
        </div>
        }
      </div>
      }
    </div>
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

  // Outputs
  readonly widgetClick = output<{ widget: WidgetConfiguration; data: unknown }>();
  readonly retryRequested = output<void>();

  // Computed properties
  readonly selectedBudget = computed(() => this.budgetSelectionService.selectedBudget());
  readonly hasSelectedBudget = computed(() => this.budgetSelectionService.hasSelectedBudget());
  readonly budgetOverview = computed(() => this.dashboardDataService.budgetOverview());
  readonly isLoading = computed(() => this.dashboardDataService.isLoading());
  readonly hasError = computed(() => !!this.dashboardDataService.error());
  readonly errorMessage = computed(() => this.dashboardDataService.error());

  readonly containerClass = computed(() => {
    const classes = ['os-dashboard-widgets'];

    if (this.variant() !== 'default') {
      classes.push(`os-dashboard-widgets--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-dashboard-widgets--${this.size()}`);
    }

    if (this.isLoading()) {
      classes.push('os-dashboard-widgets--loading');
    }

    if (this.hasError()) {
      classes.push('os-dashboard-widgets--error');
    }

    if (!this.hasSelectedBudget()) {
      classes.push('os-dashboard-widgets--empty');
    }

    return classes.join(' ');
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

  onWidgetClick(widget: WidgetConfiguration, data: unknown): void {
    this.widgetClick.emit({ widget, data });
  }
}
