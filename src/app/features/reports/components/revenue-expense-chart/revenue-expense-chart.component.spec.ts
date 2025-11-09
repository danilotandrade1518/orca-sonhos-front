import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RevenueExpenseChartComponent } from './revenue-expense-chart.component';
import { ChartDataTransformer } from '@shared/charts/chart-adapter/chart-data-transformer.service';
import type { RevenueExpenseDto } from '@dtos/report/revenue-expense.dto';

describe('RevenueExpenseChartComponent', () => {
  let component: RevenueExpenseChartComponent;
  let fixture: ComponentFixture<RevenueExpenseChartComponent>;
  let chartDataTransformer: ChartDataTransformer;

  const mockRevenueExpense: RevenueExpenseDto = {
    revenue: 5000,
    expense: 3000,
    difference: 2000,
    period: '2024-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueExpenseChartComponent],
      providers: [provideZonelessChangeDetection(), CurrencyPipe, ChartDataTransformer],
    }).compileComponents();

    fixture = TestBed.createComponent(RevenueExpenseChartComponent);
    component = fixture.componentInstance;
    chartDataTransformer = TestBed.inject(ChartDataTransformer);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default properties', () => {
    it('should have default title', () => {
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.detectChanges();

      expect(component.title()).toBe('Receitas vs Despesas');
    });

    it('should have default empty text', () => {
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.detectChanges();

      expect(component.emptyText()).toBe('Nenhum dado de receitas ou despesas disponível para o período selecionado');
    });

    it('should have default aria label', () => {
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.detectChanges();

      expect(component.ariaLabel()).toBe('Gráfico de receitas vs despesas');
    });

    it('should have showDataTable enabled by default', () => {
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.detectChanges();

      expect(component.showDataTable()).toBe(true);
    });
  });

  describe('empty state', () => {
    it('should be empty when revenueExpense is null', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('error', null);
      
      fixture.detectChanges();
      
      expect(component.empty()).toBe(true);
    });

    it('should not be empty when revenueExpense has data', () => {
      
      fixture.componentRef.setInput('revenueExpense', mockRevenueExpense);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('error', null);
      
      fixture.detectChanges();
      
      expect(component.empty()).toBe(false);
    });

    it('should not be empty when loading', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('error', null);
      
      fixture.detectChanges();
      
      expect(component.empty()).toBe(false);
    });

    it('should not be empty when error exists', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('error', 'Erro ao carregar dados');
      
      fixture.detectChanges();
      
      expect(component.empty()).toBe(false);
    });
  });

  describe('chartData computed', () => {
    it('should return empty chart data when revenueExpense is null', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const chartData = component.chartData();
      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets).toEqual([]);
    });

    it('should transform revenueExpense to chart data', () => {
      
      fixture.componentRef.setInput('revenueExpense', mockRevenueExpense);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const chartData = component.chartData();
      expect(chartData.labels).toEqual(['Receitas', 'Despesas']);
      expect(chartData.datasets).toHaveLength(1);
      expect(chartData.datasets[0].data).toEqual([5000, 3000]);
      expect(chartData.datasets[0].label).toBe('Valor');
    });

    it('should use ChartDataTransformer to transform data', () => {
      
      const transformSpy = vi.spyOn(chartDataTransformer, 'transformRevenueExpenseToChartData');
      fixture.componentRef.setInput('revenueExpense', mockRevenueExpense);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      component.chartData();
      
      expect(transformSpy).toHaveBeenCalledWith(mockRevenueExpense);
    });
  });

  describe('chartConfig computed', () => {
    it('should return chart config with correct settings', () => {
      
      fixture.componentRef.setInput('revenueExpense', mockRevenueExpense);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const config = component.chartConfig();
      expect(config.responsive).toBe(true);
      expect(config.maintainAspectRatio).toBe(true);
      expect(config.plugins?.legend?.display).toBe(true);
      expect(config.plugins?.legend?.position).toBe('top');
      expect(config.plugins?.tooltip?.enabled).toBe(true);
      expect(config.scales?.y?.beginAtZero).toBe(true);
      expect(config.scales?.y?.display).toBe(true);
      expect(config.scales?.x?.display).toBe(true);
      expect(config.animation?.duration).toBe(800);
      expect(config.animation?.easing).toBe('easeInOutQuart');
    });

    it('should have correct scale titles', () => {
      
      fixture.componentRef.setInput('revenueExpense', mockRevenueExpense);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const config = component.chartConfig();
      expect(config.scales?.y?.title?.text).toBe('Valor (R$)');
      expect(config.scales?.x?.title?.text).toBe('Tipo');
    });
  });

  describe('chartAriaLabel computed', () => {
    it('should return empty aria label when no data', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const ariaLabel = component.chartAriaLabel();
      expect(ariaLabel).toBe('Gráfico de barras vazio - nenhum dado de receitas vs despesas');
    });

    it('should return aria label with formatted values when data exists', () => {
      
      fixture.componentRef.setInput('revenueExpense', mockRevenueExpense);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const ariaLabel = component.chartAriaLabel();
      expect(ariaLabel).toContain('Gráfico de barras comparando receitas');
      expect(ariaLabel).toContain('despesas');
      expect(ariaLabel).toContain('Diferença:');
      expect(ariaLabel).toContain('R$');
    });
  });

  describe('dataTableCaption computed', () => {
    it('should return correct caption', () => {
      
      fixture.componentRef.setInput('revenueExpense', mockRevenueExpense);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      expect(component.dataTableCaption()).toBe('Tabela de dados: Receitas vs Despesas');
    });
  });

  describe('onRetry', () => {
    it('should call retry function when onRetry is called', () => {
      
      const retryFn = vi.fn();
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', retryFn);
      fixture.detectChanges();
      
      component.onRetry();
      
      expect(retryFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('inputs', () => {
    it('should accept custom title', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('title', 'Custom Title');
      fixture.detectChanges();
      
      expect(component.title()).toBe('Custom Title');
    });

    it('should accept custom subtitle', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('subtitle', 'Custom Subtitle');
      fixture.detectChanges();
      
      expect(component.subtitle()).toBe('Custom Subtitle');
    });

    it('should accept loading state', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      
      expect(component.loading()).toBe(true);
    });

    it('should accept error state', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();
      
      expect(component.error()).toBe('Error message');
    });

    it('should accept retryable state', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('retryable', true);
      fixture.detectChanges();
      
      expect(component.retryable()).toBe(true);
    });

    it('should accept showDataTable state', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('showDataTable', false);
      fixture.detectChanges();
      
      expect(component.showDataTable()).toBe(false);
    });

    it('should accept custom ariaLabel', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('ariaLabel', 'Custom Aria Label');
      fixture.detectChanges();
      
      expect(component.ariaLabel()).toBe('Custom Aria Label');
    });

    it('should accept custom ariaDescribedBy', () => {
      
      fixture.componentRef.setInput('revenueExpense', null);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('ariaDescribedBy', 'custom-description-id');
      fixture.detectChanges();
      
      expect(component.ariaDescribedBy()).toBe('custom-description-id');
    });
  });
});
