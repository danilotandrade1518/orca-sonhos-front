import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { BarChartComponent } from './bar-chart.component';
import { ChartAdapterService } from '../../chart-adapter/chart-adapter.service';
import { ChartConfigMapper } from '../../chart-adapter/chart-config-mapper.service';
import type { ChartData } from '../../interfaces/chart-data.interface';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  const mockChartData: ChartData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        label: 'Valor',
        data: [5000, 3000],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#388E3C', '#D32F2F'],
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
      providers: [
        provideZonelessChangeDetection(),
        ChartAdapterService,
        ChartConfigMapper,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default config', () => {
    it('should have default config with legend at top and scales configured', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      
      fixture.detectChanges();
      
      const config = component.config();
      expect(config.plugins?.legend?.position).toBe('top');
      expect(config.plugins?.legend?.display).toBe(true);
      expect(config.plugins?.tooltip?.enabled).toBe(true);
      expect(config.scales?.y?.beginAtZero).toBe(true);
      expect(config.scales?.y?.display).toBe(true);
      expect(config.scales?.x?.display).toBe(true);
    });
  });

  describe('inputs', () => {
    it('should accept data input', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.detectChanges();
      
      expect(component.data()).toEqual(mockChartData);
    });

    it('should accept custom config input', () => {
      
      const customConfig = {
        plugins: {
          legend: {
            display: false,
            position: 'bottom' as const,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            display: true,
          },
        },
      };
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('config', customConfig);
      fixture.detectChanges();
      
      expect(component.config().plugins?.legend?.display).toBe(false);
      expect(component.config().scales?.y?.beginAtZero).toBe(false);
    });

    it('should accept ariaLabel input', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('ariaLabel', 'Custom Bar Chart');
      fixture.detectChanges();
      
      expect(component.ariaLabel()).toBe('Custom Bar Chart');
    });

    it('should have default ariaLabel', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.detectChanges();
      
      expect(component.ariaLabel()).toBe('Gráfico de barras');
    });

    it('should accept showDataTable input', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('showDataTable', true);
      fixture.detectChanges();
      
      expect(component.showDataTable()).toBe(true);
    });

    it('should accept dataTableCaption input', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('dataTableCaption', 'Custom Caption');
      fixture.detectChanges();
      
      expect(component.dataTableCaption()).toBe('Custom Caption');
    });

    it('should have default dataTableCaption', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.detectChanges();
      
      expect(component.dataTableCaption()).toBe('Tabela de dados do gráfico de barras');
    });
  });

  describe('ChartType', () => {
    it('should expose ChartType enum', () => {
      expect(component.ChartType).toBeDefined();
      expect(component.ChartType.BAR).toBe('bar');
    });
  });
});
