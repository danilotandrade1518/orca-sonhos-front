import { inject, Injectable } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

import type { ChartConfig } from '../interfaces/chart-config.interface';
import type { ChartData } from '../interfaces/chart-data.interface';
import type { ChartType } from '../interfaces/chart-type.enum';
import { ChartConfigMapper } from './chart-config-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class ChartAdapterService {
  private readonly configMapper = inject(ChartConfigMapper);

  convertToChartJsConfiguration<T extends ChartType>(
    data: ChartData,
    config: ChartConfig,
    type: T
  ): ChartConfiguration<T> {
    const chartData = this.convertData(data);
    const chartOptions = this.configMapper.mapToChartJsOptions(config);

    return {
      type,
      data: chartData,
      options: chartOptions,
    } as ChartConfiguration<T>;
  }

  private convertData(data: ChartData): ChartConfiguration['data'] {
    return {
      labels: data.labels,
      datasets: data.datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor,
        borderColor: dataset.borderColor,
        borderWidth: dataset.borderWidth ?? 1,
      })),
    };
  }
}
