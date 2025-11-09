import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { ChartContainerComponent } from '@shared/ui-components/molecules/chart-container/chart-container.component';
import { PieChartComponent } from '@shared/charts/components/pie-chart/pie-chart.component';
import { ChartDataTransformer } from '@shared/charts/chart-adapter/chart-data-transformer.service';
import type { ChartData } from '@shared/charts/interfaces/chart-data.interface';
import type { ChartConfig } from '@shared/charts/interfaces/chart-config.interface';
import type { CategorySpendingDto } from '@dtos/report/category-spending.dto';

@Component({
  selector: 'os-spending-chart',
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
      <os-pie-chart
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
  imports: [CommonModule, ChartContainerComponent, PieChartComponent],
  providers: [CurrencyPipe],
})
export class SpendingChartComponent {
  private readonly chartDataTransformer = inject(ChartDataTransformer);
  private readonly currencyPipe = inject(CurrencyPipe);

  categorySpending = input.required<CategorySpendingDto[]>();
  title = input<string>('Gastos por Categoria');
  subtitle = input<string>('');
  loading = input(false);
  error = input<string | null>(null);
  retryable = input(false);
  showDataTable = input(true);
  ariaLabel = input<string>('Gráfico de gastos por categoria');
  ariaDescribedBy = input<string>();

  retry = input.required<() => void>();

  readonly empty = computed(() => {
    return !this.loading() && !this.error() && this.categorySpending().length === 0;
  });

  readonly emptyText = computed(() => {
    return 'Nenhum gasto encontrado para o período selecionado';
  });

  readonly chartData = computed<ChartData>(() => {
    const spending = this.categorySpending();
    if (spending.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }
    return this.chartDataTransformer.transformCategorySpendingToChartData(spending);
  });

  readonly chartConfig = computed<ChartConfig>(() => {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
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
      animation: {
        duration: 800,
        easing: 'easeInOutQuart',
      },
    };
  });

  readonly chartAriaLabel = computed(() => {
    const spending = this.categorySpending();
    if (spending.length === 0) {
      return 'Gráfico de pizza vazio - nenhum gasto por categoria';
    }
    const total = spending.reduce((sum, item) => sum + item.totalAmount, 0);
    const formattedTotal = this.currencyPipe.transform(total, 'BRL', 'symbol', '1.2-2') || '';
    return `Gráfico de pizza mostrando distribuição de gastos por categoria. Total: ${formattedTotal}`;
  });

  readonly dataTableCaption = computed(() => {
    return 'Tabela de dados: Gastos por Categoria';
  });

  onRetry(): void {
    this.retry()();
  }
}
