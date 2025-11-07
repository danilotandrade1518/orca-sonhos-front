import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { ChartAdapterService } from '../../chart-adapter/chart-adapter.service';
import type { ChartConfig } from '../../interfaces/chart-config.interface';
import type { ChartData } from '../../interfaces/chart-data.interface';
import type { ChartType } from '../../interfaces/chart-type.enum';

@Component({
  selector: 'os-base-chart',
  template: `
    <div
      [class]="containerClass()"
      [attr.role]="'img'"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy()"
    >
      <canvas
        baseChart
        [data]="chartConfiguration()?.data"
        [options]="chartConfiguration()?.options"
        [type]="type()"
        [attr.aria-label]="ariaLabel()"
      ></canvas>
      @if (showDataTable()) {
      <div class="os-base-chart__data-table" role="table" [attr.aria-label]="dataTableAriaLabel()">
        <table>
          <caption>{{ dataTableCaption() }}</caption>
          <thead>
            <tr>
              <th scope="col">Categoria</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            @for (item of dataTableRows(); track item.label) {
            <tr>
              <td>{{ item.label }}</td>
              <td>{{ item.value | currency: 'BRL' }}</td>
            </tr>
            }
          </tbody>
        </table>
      </div>
      }
    </div>
  `,
  styleUrls: ['./base-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BaseChartDirective, CurrencyPipe],
})
export class BaseChartComponent<T extends ChartType = ChartType> {
  protected readonly chartAdapter = inject(ChartAdapterService);

  data = input.required<ChartData>();
  config = input<ChartConfig>({});
  type = input.required<T>();
  ariaLabel = input<string>();
  ariaDescribedBy = input<string>();
  showDataTable = input(false);
  dataTableCaption = input<string>('Tabela de dados do gráfico');

  private readonly _chartConfiguration = signal<ChartConfiguration<T> | null>(null);

  readonly chartConfiguration = computed(() => {
    const currentData = this.data();
    const currentConfig = this.config();
    const currentType = this.type();

    if (!currentData || !currentType) {
      return null;
    }

    const config = this.chartAdapter.convertToChartJsConfiguration(
      currentData,
      currentConfig,
      currentType
    );

    this._chartConfiguration.set(config);
    return config;
  });

  readonly containerClass = computed(() => {
    return ['os-base-chart', `os-base-chart--${this.type()}`].filter(Boolean).join(' ');
  });

  readonly dataTableRows = computed(() => {
    const chartData = this.data();
    if (!chartData || !chartData.datasets[0]) {
      return [];
    }

    return chartData.labels.map((label, index) => ({
      label,
      value: chartData.datasets[0].data[index] || 0,
    }));
  });

  readonly dataTableAriaLabel = computed(() => {
    return this.dataTableCaption() || 'Tabela de dados do gráfico';
  });
}

