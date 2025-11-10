import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OsPageHeaderComponent } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { ReportFiltersComponent } from '../../components/report-filters/report-filters.component';
import { ReportSummaryCardComponent } from '@shared/ui-components/molecules/report-summary-card/report-summary-card.component';
import { SpendingChartComponent } from '../../components/spending-chart/spending-chart.component';
import { RevenueExpenseChartComponent } from '../../components/revenue-expense-chart/revenue-expense-chart.component';
import { ReportsState } from '../../state/reports-state/reports.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { CurrencyPipe } from '@shared/formatting';
import type { ReportFilters } from '../../types/reports.types';
import type { BudgetOption } from '@shared/ui-components/molecules/os-budget-selector/os-budget-selector.component';

@Component({
  selector: 'os-reports-page',
  template: `
    <div class="reports-page" role="main" aria-label="Página de relatórios financeiros">
      <!-- Header -->
      <os-page-header
        [title]="'Relatórios Financeiros'"
        [subtitle]="'Análise visual dos seus gastos e receitas'"
        [icon]="'analytics'"
        [variant]="'default'"
        [size]="'medium'"
        [ariaLabel]="'Cabeçalho da página de relatórios'"
      />

      <!-- Filters Bar (Sticky) -->
      <div class="reports-page__filters-bar" [class.reports-page__filters-bar--sticky]="true">
        <os-report-filters
          [initialFilters]="initialFilters()"
          [budgets]="budgets()"
          [selectedBudgetId]="selectedBudgetId()"
          [showBudgetSelector]="showBudgetSelector()"
          (filtersChange)="onFiltersChange($event)"
        />
      </div>

      <!-- Main Content -->
      <div class="reports-page__content">
        @if (currentState() === 'loading') {
        <div class="reports-page__loading" role="status" aria-live="polite" aria-label="Carregando relatórios">
          <div class="reports-page__loading-content">
            <p class="reports-page__loading-text">Carregando dados dos relatórios...</p>
          </div>
        </div>
        } @else if (currentState() === 'error') {
        <div class="reports-page__error" role="alert" aria-live="assertive">
          <div class="reports-page__error-content">
            <p class="reports-page__error-message">{{ errorMessage() }}</p>
            <button
              type="button"
              class="reports-page__retry-button"
              (click)="onRetry()"
              [attr.aria-label]="'Tentar carregar relatórios novamente'"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
        } @else {
        <!-- Summary Cards -->
        <section
          class="reports-page__summary-section"
          role="region"
          aria-label="Resumo financeiro do período selecionado"
        >
          <div class="reports-page__summary-grid">
            <os-report-summary-card
              [label]="'Total de Gastos'"
              [value]="totalExpenses()"
              [variant]="'negative'"
              [icon]="'money'"
              [ariaLabel]="'Total de gastos: ' + totalExpenses()"
            />
            <os-report-summary-card
              [label]="'Total de Receitas'"
              [value]="totalRevenue()"
              [variant]="'positive'"
              [icon]="'trending-up'"
              [ariaLabel]="'Total de receitas: ' + totalRevenue()"
            />
            <os-report-summary-card
              [label]="'Diferença'"
              [value]="difference()"
              [variant]="differenceVariant()"
              [change]="differenceChange()"
              [icon]="differenceIcon()"
              [ariaLabel]="'Diferença entre receitas e gastos: ' + difference()"
            />
          </div>
        </section>

        <!-- Charts Section -->
        <section
          class="reports-page__charts-section"
          role="region"
          aria-label="Gráficos de análise financeira"
        >
          <!-- Spending Chart -->
          <div class="reports-page__chart-item">
            <os-spending-chart
              [categorySpending]="categorySpending()"
              [title]="'Gastos por Categoria'"
              [subtitle]="'Distribuição dos gastos por categoria no período selecionado'"
              [loading]="loading()"
              [error]="error()"
              [retryable]="!!error()"
              [ariaLabel]="'Gráfico de pizza mostrando distribuição de gastos por categoria'"
              [retry]="onRetry"
            />
          </div>

          <!-- Revenue vs Expense Chart -->
          <div class="reports-page__chart-item">
            <os-revenue-expense-chart
              [revenueExpense]="revenueExpense()"
              [title]="'Receitas vs Despesas'"
              [subtitle]="'Comparação entre receitas e despesas no período selecionado'"
              [loading]="loading()"
              [error]="error()"
              [retryable]="!!error()"
              [ariaLabel]="'Gráfico de barras comparando receitas e despesas'"
              [retry]="onRetry"
            />
          </div>
        </section>
        }
      </div>
    </div>
  `,
  styleUrl: './reports.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    OsPageHeaderComponent,
    ReportFiltersComponent,
    ReportSummaryCardComponent,
    SpendingChartComponent,
    RevenueExpenseChartComponent,
    CurrencyPipe,
  ],
})
export class ReportsPage implements OnInit {
  private readonly reportsState = inject(ReportsState);
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly currencyPipe = inject(CurrencyPipe);

  readonly loading = this.reportsState.loading;
  readonly error = this.reportsState.error;
  readonly categorySpending = this.reportsState.categorySpending;
  readonly revenueExpense = this.reportsState.revenueExpense;
  readonly totals = this.reportsState.totals;
  readonly selectedBudgetId = this.reportsState.selectedBudgetId;
  readonly filters = this.reportsState.filters;

  readonly hasCategorySpending = this.reportsState.hasCategorySpending;
  readonly hasData = this.reportsState.hasData;

  readonly budgets = computed<BudgetOption[]>(() => {
    const budgets = this.budgetSelectionService.availableBudgets();
    return budgets.map((budget) => ({
      id: budget.id,
      name: budget.name,
      description: undefined,
      isActive: true,
      isShared: budget.type === 'SHARED',
      participants: budget.participantsCount,
    }));
  });

  readonly showBudgetSelector = computed(() => {
    return this.budgets().length > 1;
  });

  readonly initialFilters = computed(() => {
    return {
      period: this.filters().period,
      budgetId: this.filters().budgetId,
    };
  });

  readonly currentState = computed(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    return 'success';
  });

  readonly errorMessage = computed(() => {
    return this.error() || 'Erro ao carregar relatórios';
  });

  readonly totalExpenses = computed(() => {
    const total = this.totals().totalExpense;
    return this.currencyPipe.transform(total, 'BRL') || 'R$ 0,00';
  });

  readonly totalRevenue = computed(() => {
    const total = this.totals().totalRevenue;
    return this.currencyPipe.transform(total, 'BRL') || 'R$ 0,00';
  });

  readonly difference = computed(() => {
    const diff = this.totals().totalDifference;
    return this.currencyPipe.transform(diff, 'BRL') || 'R$ 0,00';
  });

  readonly differenceVariant = computed(() => {
    const diff = this.totals().totalDifference;
    if (diff > 0) return 'positive';
    if (diff < 0) return 'negative';
    return 'neutral';
  });

  readonly differenceChange = computed(() => {
    const diff = this.totals().totalDifference;
    const totalExpense = this.totals().totalExpense;
    const percentage = totalExpense > 0
      ? ((diff / totalExpense) * 100).toFixed(1)
      : '0.0';
    return diff !== 0 ? `${diff > 0 ? '+' : ''}${percentage}%` : '';
  });

  readonly differenceIcon = computed(() => {
    const diff = this.totals().totalDifference;
    if (diff > 0) return 'trending-up';
    if (diff < 0) return 'trending-down';
    return '';
  });

  readonly hasRevenueExpense = computed(() => {
    return this.revenueExpense() !== null;
  });

  constructor() {
    effect(() => {
      const budgetId = this.selectedBudgetId();
      if (budgetId) {
        this.reportsState.loadReports(true);
      }
    });
  }

  ngOnInit(): void {
    this.reportsState.loadReports();
  }

  onFiltersChange(filters: ReportFilters): void {
    this.reportsState.updateFilters(filters);
    this.reportsState.loadReports(true);
  }

  readonly onRetry = () => {
    this.reportsState.loadReports(true);
  };
}
