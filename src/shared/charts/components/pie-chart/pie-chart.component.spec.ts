import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { PieChartComponent } from './pie-chart.component';
import { ChartAdapterService } from '../../chart-adapter/chart-adapter.service';
import { ChartConfigMapper } from '../../chart-adapter/chart-config-mapper.service';
import type { ChartData } from '../../interfaces/chart-data.interface';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  const mockChartData: ChartData = {
    labels: ['Category 1', 'Category 2'],
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: [100, 200],
        backgroundColor: ['#FF0000', '#00FF00'],
        borderColor: ['#CC0000', '#00CC00'],
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
      providers: [
        provideZonelessChangeDetection(),
        ChartAdapterService,
        ChartConfigMapper,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default config', () => {
    it('should have default config with legend at bottom', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      
      fixture.detectChanges();
      
      const config = component.config();
      expect(config.plugins?.legend?.position).toBe('bottom');
      expect(config.plugins?.legend?.display).toBe(true);
      expect(config.plugins?.tooltip?.enabled).toBe(true);
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
            position: 'top' as const,
          },
        },
      };
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('config', customConfig);
      fixture.detectChanges();
      
      expect(component.config().plugins?.legend?.display).toBe(false);
    });

    it('should accept ariaLabel input', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.componentRef.setInput('ariaLabel', 'Custom Pie Chart');
      fixture.detectChanges();
      
      expect(component.ariaLabel()).toBe('Custom Pie Chart');
    });

    it('should have default ariaLabel', () => {
      
      fixture.componentRef.setInput('data', mockChartData);
      fixture.detectChanges();
      
      expect(component.ariaLabel()).toBe('Gráfico de pizza');
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
      
      expect(component.dataTableCaption()).toBe('Tabela de dados do gráfico de pizza');
    });
  });

  describe('ChartType', () => {
    it('should expose ChartType enum', () => {
      expect(component.ChartType).toBeDefined();
      expect(component.ChartType.PIE).toBe('pie');
    });
  });
});
