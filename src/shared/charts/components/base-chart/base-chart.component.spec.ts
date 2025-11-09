import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { BaseChartComponent } from './base-chart.component';
import { ChartAdapterService } from '../../chart-adapter/chart-adapter.service';
import { ChartConfigMapper } from '../../chart-adapter/chart-config-mapper.service';
import type { ChartData } from '../../interfaces/chart-data.interface';
import { ChartType } from '../../interfaces/chart-type.enum';

describe('BaseChartComponent', () => {
  let component: BaseChartComponent;
  let fixture: ComponentFixture<BaseChartComponent>;

  const mockChartData: ChartData = {
    labels: ['Label 1', 'Label 2'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [10, 20],
        backgroundColor: ['#FF0000', '#00FF00'],
        borderColor: ['#CC0000', '#00CC00'],
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseChartComponent],
      providers: [
        provideZonelessChangeDetection(),
        ChartAdapterService,
        ChartConfigMapper,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseChartComponent);
    component = fixture.componentInstance;
    // Set required inputs before first detectChanges
    fixture.componentRef.setInput('data', mockChartData);
    fixture.componentRef.setInput('type', ChartType.PIE);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('chartConfiguration computed', () => {
    it('should generate chart configuration from data and config', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      
      fixture.detectChanges();
      
      const config = component.chartConfiguration();
      expect(config).toBeTruthy();
      expect(config?.type).toBe('pie');
      expect(config?.data.labels).toEqual(['Label 1', 'Label 2']);
      expect(config?.data.datasets).toHaveLength(1);
    });

    it('should return null when data is not provided', () => {
      
      // Reset component with only type
      fixture = TestBed.createComponent(BaseChartComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('data', null);
      fixture.componentRef.setInput('type', ChartType.PIE);
      
      fixture.detectChanges();
      
      const config = component.chartConfiguration();
      expect(config).toBeNull();
    });

    it('should return null when type is not provided', () => {
      
      // Reset component with only data
      fixture = TestBed.createComponent(BaseChartComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', null);
      
      fixture.detectChanges();
      
      const config = component.chartConfiguration();
      expect(config).toBeNull();
    });

    it('should update configuration when data changes', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      // Don't call detectChanges to avoid Chart.js DOM access

      const initialConfig = component.chartConfiguration();
      
      const newData: ChartData = {
        labels: ['New Label'],
        datasets: [
          {
            label: 'New Dataset',
            data: [30],
            backgroundColor: ['#0000FF'],
            borderColor: ['#0000CC'],
          },
        ],
      };
      fixture.componentRef.setInput('data', newData);
      // Don't call detectChanges to avoid Chart.js DOM access
      
      const newConfig = component.chartConfiguration();
      expect(newConfig).not.toEqual(initialConfig);
      expect(newConfig?.data.labels).toEqual(['New Label']);
    });
  });

  describe('containerClass computed', () => {
    it('should generate container class with chart type', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      
      fixture.detectChanges();
      
      expect(component.containerClass()).toBe('os-base-chart os-base-chart--pie');
    });

    it('should generate different class for bar chart', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.BAR);
      
      fixture.detectChanges();
      
      expect(component.containerClass()).toBe('os-base-chart os-base-chart--bar');
    });
  });

  describe('dataTableRows computed', () => {
    it('should generate data table rows from chart data', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      
      fixture.detectChanges();
      
      const rows = component.dataTableRows();
      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual({ label: 'Label 1', value: 10 });
      expect(rows[1]).toEqual({ label: 'Label 2', value: 20 });
    });

    it('should return empty array when data is not provided', () => {
      
      // Reset component with empty data structure
      fixture = TestBed.createComponent(BaseChartComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('data', { labels: [], datasets: [] });
      fixture.componentRef.setInput('type', ChartType.PIE);
      // Don't call detectChanges to avoid Chart.js DOM access
      
      expect(component.dataTableRows()).toEqual([]);
    });

    it('should handle missing data values', () => {
      
      const dataWithMissing: ChartData = {
        labels: ['Label 1', 'Label 2', 'Label 3'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [10, 20],
            backgroundColor: ['#FF0000', '#00FF00'],
            borderColor: ['#CC0000', '#00CC00'],
          },
        ],
      };
      fixture.componentRef.setInput('data', dataWithMissing);
      fixture.componentRef.setInput('type', ChartType.PIE);
      
      fixture.detectChanges();
      
      const rows = component.dataTableRows();
      expect(rows).toHaveLength(3);
      expect(rows[2].value).toBe(0);
    });
  });

  describe('dataTableAriaLabel computed', () => {
    it('should use custom caption when provided', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      fixture.componentRef.setInput('dataTableCaption', 'Custom Caption');
      
      fixture.detectChanges();
      
      expect(component.dataTableAriaLabel()).toBe('Custom Caption');
    });

    it('should use default caption when not provided', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      
      fixture.detectChanges();
      
      expect(component.dataTableAriaLabel()).toBe('Tabela de dados do gráfico');
    });
  });

  describe('inputs', () => {
    it('should accept ariaLabel input', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      fixture.componentRef.setInput('ariaLabel', 'Custom ARIA Label');
      
      fixture.detectChanges();
      
      expect(component.ariaLabel()).toBe('Custom ARIA Label');
    });

    it('should accept ariaDescribedBy input', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      fixture.componentRef.setInput('ariaDescribedBy', 'description-id');
      
      fixture.detectChanges();
      
      expect(component.ariaDescribedBy()).toBe('description-id');
    });

    it('should accept showDataTable input', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('type', ChartType.PIE);
      fixture.componentRef.setInput('showDataTable', true);
      
      fixture.detectChanges();
      
      expect(component.showDataTable()).toBe(true);
    });
  });
});
