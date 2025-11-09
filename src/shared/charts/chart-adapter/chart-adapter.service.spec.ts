import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { ChartAdapterService } from './chart-adapter.service';
import { ChartConfigMapper } from './chart-config-mapper.service';
import type { ChartConfig } from '../interfaces/chart-config.interface';
import type { ChartData } from '../interfaces/chart-data.interface';
import { ChartType } from '../interfaces/chart-type.enum';

describe('ChartAdapterService', () => {
  let service: ChartAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartAdapterService, ChartConfigMapper, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(ChartAdapterService);
  });

  describe('convertToChartJsConfiguration', () => {
    it('should convert ChartData and ChartConfig to Chart.js configuration', () => {
      const chartData: ChartData = {
        labels: ['Label 1', 'Label 2'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [10, 20],
            backgroundColor: ['#FF0000', '#00FF00'],
            borderColor: ['#CC0000', '#00CC00'],
            borderWidth: 2,
          },
        ],
      };

      const chartConfig: ChartConfig = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      };

      const result = service.convertToChartJsConfiguration(chartData, chartConfig, ChartType.PIE);

      expect(result.type).toBe('pie');
      expect(result.data.labels).toEqual(['Label 1', 'Label 2']);
      expect(result.data.datasets).toHaveLength(1);
      expect(result.data.datasets[0].label).toBe('Dataset 1');
      expect(result.data.datasets[0].data).toEqual([10, 20]);
      expect(result.data.datasets[0].backgroundColor).toEqual(['#FF0000', '#00FF00']);
      expect(result.data.datasets[0].borderColor).toEqual(['#CC0000', '#00CC00']);
      expect(result.data.datasets[0].borderWidth).toBe(2);
      expect(result.options).toBeDefined();
    });

    it('should use default borderWidth when not provided', () => {
      const chartData: ChartData = {
        labels: ['Label 1'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [10],
            backgroundColor: ['#FF0000'],
            borderColor: ['#CC0000'],
          },
        ],
      };

      const chartConfig: ChartConfig = {
        responsive: true,
      };

      const result = service.convertToChartJsConfiguration(chartData, chartConfig, ChartType.BAR);

      expect(result.data.datasets[0].borderWidth).toBe(1);
    });

    it('should handle multiple datasets', () => {
      const chartData: ChartData = {
        labels: ['Label 1', 'Label 2'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [10, 20],
            backgroundColor: ['#FF0000', '#00FF00'],
            borderColor: ['#CC0000', '#00CC00'],
          },
          {
            label: 'Dataset 2',
            data: [30, 40],
            backgroundColor: ['#0000FF', '#FFFF00'],
            borderColor: ['#0000CC', '#CCCC00'],
          },
        ],
      };

      const chartConfig: ChartConfig = {
        responsive: true,
      };

      const result = service.convertToChartJsConfiguration(chartData, chartConfig, ChartType.BAR);

      expect(result.data.datasets).toHaveLength(2);
      expect(result.data.datasets[0].label).toBe('Dataset 1');
      expect(result.data.datasets[1].label).toBe('Dataset 2');
    });

    it('should work with different chart types', () => {
      const chartData: ChartData = {
        labels: ['Label 1'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [10],
            backgroundColor: ['#FF0000'],
            borderColor: ['#CC0000'],
          },
        ],
      };

      const chartConfig: ChartConfig = {
        responsive: true,
      };

      const pieResult = service.convertToChartJsConfiguration(
        chartData,
        chartConfig,
        ChartType.PIE
      );
      expect(pieResult.type).toBe('pie');

      const barResult = service.convertToChartJsConfiguration(
        chartData,
        chartConfig,
        ChartType.BAR
      );
      expect(barResult.type).toBe('bar');

      const lineResult = service.convertToChartJsConfiguration(
        chartData,
        chartConfig,
        ChartType.LINE
      );
      expect(lineResult.type).toBe('line');
    });
  });
});
