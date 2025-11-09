import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { ChartContainerComponent } from '@shared/ui-components/molecules/chart-container/chart-container.component';
import { BarChartComponent } from '@shared/charts/components/bar-chart/bar-chart.component';
import { ChartDataTransformer } from '@shared/charts/chart-adapter/chart-data-transformer.service';
import type { ChartData } from '@shared/charts/interfaces/chart-data.interface';
import type { ChartConfig } from '@shared/charts/interfaces/chart-config.interface';
import type { RevenueExpenseDto } from '@dtos/report/revenue-expense.dto';

@Component({
  selector: 'os-revenue-expense-chart',
  template: `
    <os-chart-container
      [title]="title()"
      [subtitle]="subtitle()"
      [loading]="loading()"
      [error]="error()"
      [empty]="empty()"
      [emptyText]="emptyText()"
      [retryable]="retryable()"
      [ariaLabel]="ariaLabel()"
      (retry)="onRetry()"
    >
      @if (!loading() && !error() && !empty()) {
      <os-bar-chart
        [data]="chartData()"
        [config]="chartConfig()"
        [ariaLabel]="chartAriaLabel()"
        [ariaDescribedBy]="ariaDescribedBy()"
        [showDataTable]="showDataTable()"
        [dataTableCaption]="dataTableCaption()"
      />
      }
    </os-chart-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ChartContainerComponent, BarChartComponent],
  providers: [CurrencyPipe],
})
export class RevenueExpenseChartComponent {
  private readonly chartDataTransformer = inject(ChartDataTransformer);
  private readonly currencyPipe = inject(CurrencyPipe);

  revenueExpense = input<RevenueExpenseDto | null>(null);
  title = input<string>('Receitas vs Despesas');
  subtitle = input<string>('');
  loading = input(false);
  error = input<string | null>(null);
  retryable = input(false);
  showDataTable = input(true);
  ariaLabel = input<string>('Gráfico de receitas vs despesas');
  ariaDescribedBy = input<string>();

  retry = input.required<() => void>();

  readonly empty = computed(() => {
    return !this.loading() && !this.error() && !this.revenueExpense();
  });

  readonly emptyText = computed(() => {
    return 'Nenhum dado de receitas ou despesas disponível para o período selecionado';
  });

  readonly chartData = computed<ChartData>(() => {
    const data = this.revenueExpense();
    if (!data) {
      return {
        labels: [],
        datasets: [],
      };
    }
    return this.chartDataTransformer.transformRevenueExpenseToChartData(data);
  });

  readonly chartConfig = computed<ChartConfig>(() => {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 12,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          display: true,
          title: {
            display: true,
            text: 'Valor (R$)',
          },
        },
        x: {
          display: true,
          title: {
            display: true,
            text: 'Tipo',
          },
        },
      },
      animation: {
        duration: 800,
        easing: 'easeInOutQuart',
      },
    };
  });

  readonly chartAriaLabel = computed(() => {
    const data = this.revenueExpense();
    if (!data) {
      return 'Gráfico de barras vazio - nenhum dado de receitas vs despesas';
    }
    const formattedRevenue = this.currencyPipe.transform(data.revenue, 'BRL', 'symbol', '1.2-2') || '';
    const formattedExpense = this.currencyPipe.transform(data.expense, 'BRL', 'symbol', '1.2-2') || '';
    const formattedDifference = this.currencyPipe.transform(data.difference, 'BRL', 'symbol', '1.2-2') || '';
    return `Gráfico de barras comparando receitas (${formattedRevenue}) e despesas (${formattedExpense}). Diferença: ${formattedDifference}`;
  });

  readonly dataTableCaption = computed(() => {
    return 'Tabela de dados: Receitas vs Despesas';
  });

  onRetry(): void {
    this.retry()();
  }
}
