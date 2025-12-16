import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BaseChartComponent } from '../base-chart/base-chart.component';
import type { ChartConfig } from '../../interfaces/chart-config.interface';
import type { ChartData } from '../../interfaces/chart-data.interface';
import { ChartType } from '../../interfaces/chart-type.enum';

@Component({
  selector: 'os-bar-chart',
  template: `
    <os-base-chart
      [data]="data()"
      [config]="config()"
      [type]="ChartType.BAR"
      [ariaLabel]="ariaLabel()"
      [ariaDescribedBy]="ariaDescribedBy()"
      [showDataTable]="showDataTable()"
      [dataTableCaption]="dataTableCaption()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseChartComponent],
})
export class BarChartComponent {
  readonly ChartType = ChartType;

  data = input.required<ChartData>();
  config = input<ChartConfig>({
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        display: true,
      },
      x: {
        display: true,
      },
    },
  });
  ariaLabel = input<string>('Gráfico de barras');
  ariaDescribedBy = input<string>();
  showDataTable = input(false);
  dataTableCaption = input<string>('Tabela de dados do gráfico de barras');
}
