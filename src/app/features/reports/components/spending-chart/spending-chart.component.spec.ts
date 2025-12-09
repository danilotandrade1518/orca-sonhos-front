import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SpendingChartComponent } from './spending-chart.component';
import { ChartDataTransformer } from '@shared/charts/chart-adapter/chart-data-transformer.service';
import type { CategorySpendingDto } from '@dtos/report/category-spending.dto';

describe('SpendingChartComponent', () => {
  let component: SpendingChartComponent;
  let fixture: ComponentFixture<SpendingChartComponent>;
  let chartDataTransformer: ChartDataTransformer;

  const mockCategorySpending: CategorySpendingDto[] = [
    {
      categoryId: '1',
      categoryName: 'Alimentação',
      totalAmount: 1000,
      percentage: 50,
      transactionCount: 10,
    },
    {
      categoryId: '2',
      categoryName: 'Transporte',
      totalAmount: 500,
      percentage: 25,
      transactionCount: 5,
    },
    {
      categoryId: '3',
      categoryName: 'Lazer',
      totalAmount: 500,
      percentage: 25,
      transactionCount: 3,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingChartComponent],
      providers: [provideZonelessChangeDetection(), CurrencyPipe, ChartDataTransformer],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingChartComponent);
    component = fixture.componentInstance;
    chartDataTransformer = TestBed.inject(ChartDataTransformer);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default properties', () => {
    it('should have default title', () => {
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.detectChanges();

      expect(component.title()).toBe('Gastos por Categoria');
    });

    it('should have default empty text', () => {
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.detectChanges();

      expect(component.emptyText()).toBe('Nenhum gasto encontrado para o período selecionado');
    });

    it('should have default aria label', () => {
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.detectChanges();

      expect(component.ariaLabel()).toBe('Gráfico de gastos por categoria');
    });

    it('should have showDataTable enabled by default', () => {
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.detectChanges();

      expect(component.showDataTable()).toBe(true);
    });
  });

  describe('empty state', () => {
    it('should be empty when categorySpending is empty array', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('error', null);
      
      fixture.detectChanges();
      
      expect(component.empty()).toBe(true);
    });

    it('should not be empty when categorySpending has data', () => {
      
      fixture.componentRef.setInput('categorySpending', mockCategorySpending);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('error', null);
      
      fixture.detectChanges();
      
      expect(component.empty()).toBe(false);
    });

    it('should not be empty when loading', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('error', null);
      
      fixture.detectChanges();
      
      expect(component.empty()).toBe(false);
    });

    it('should not be empty when error exists', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('error', 'Erro ao carregar dados');
      
      fixture.detectChanges();
      
      expect(component.empty()).toBe(false);
    });
  });

  describe('chartData computed', () => {
    it('should return empty chart data when categorySpending is empty', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const chartData = component.chartData();
      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets).toEqual([]);
    });

    it('should transform categorySpending to chart data', () => {
      
      fixture.componentRef.setInput('categorySpending', mockCategorySpending);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const chartData = component.chartData();
      expect(chartData.labels).toEqual(['Alimentação', 'Transporte', 'Lazer']);
      expect(chartData.datasets).toHaveLength(1);
      // CategorySpendingDto.totalAmount vem em centavos; o ChartDataTransformer converte para reais
      expect(chartData.datasets[0].data).toEqual([1000 / 100, 500 / 100, 500 / 100]);
      expect(chartData.datasets[0].label).toBe('Gastos por Categoria');
    });

    it('should use ChartDataTransformer to transform data', () => {
      
      const transformSpy = vi.spyOn(chartDataTransformer, 'transformCategorySpendingToChartData');
      fixture.componentRef.setInput('categorySpending', mockCategorySpending);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      component.chartData();
      
      expect(transformSpy).toHaveBeenCalledWith(mockCategorySpending);
    });
  });

  describe('chartConfig computed', () => {
    it('should return chart config with correct settings', () => {
      
      fixture.componentRef.setInput('categorySpending', mockCategorySpending);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const config = component.chartConfig();
      expect(config.responsive).toBe(true);
      expect(config.maintainAspectRatio).toBe(true);
      expect(config.plugins?.legend?.display).toBe(true);
      expect(config.plugins?.legend?.position).toBe('bottom');
      expect(config.plugins?.tooltip?.enabled).toBe(true);
      expect(config.animation?.duration).toBe(800);
      expect(config.animation?.easing).toBe('easeInOutQuart');
    });
  });

  describe('chartAriaLabel computed', () => {
    it('should return empty aria label when no data', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const ariaLabel = component.chartAriaLabel();
      expect(ariaLabel).toBe('Gráfico de pizza vazio - nenhum gasto por categoria');
    });

    it('should return aria label with formatted total when data exists', () => {
      
      fixture.componentRef.setInput('categorySpending', mockCategorySpending);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      const ariaLabel = component.chartAriaLabel();
      expect(ariaLabel).toContain('Gráfico de pizza mostrando distribuição de gastos por categoria');
      expect(ariaLabel).toContain('Total:');
      expect(ariaLabel).toContain('R$');
    });
  });

  describe('dataTableCaption computed', () => {
    it('should return correct caption', () => {
      
      fixture.componentRef.setInput('categorySpending', mockCategorySpending);
      fixture.componentRef.setInput('retry', vi.fn());
      
      fixture.detectChanges();
      
      expect(component.dataTableCaption()).toBe('Tabela de dados: Gastos por Categoria');
    });
  });

  describe('onRetry', () => {
    it('should call retry function when onRetry is called', () => {
      
      const retryFn = vi.fn();
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', retryFn);
      fixture.detectChanges();
      
      component.onRetry();
      
      expect(retryFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('inputs', () => {
    it('should accept custom title', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('title', 'Custom Title');
      fixture.detectChanges();
      
      expect(component.title()).toBe('Custom Title');
    });

    it('should accept custom subtitle', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('subtitle', 'Custom Subtitle');
      fixture.detectChanges();
      
      expect(component.subtitle()).toBe('Custom Subtitle');
    });

    it('should accept loading state', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      
      expect(component.loading()).toBe(true);
    });

    it('should accept error state', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();
      
      expect(component.error()).toBe('Error message');
    });

    it('should accept retryable state', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('retryable', true);
      fixture.detectChanges();
      
      expect(component.retryable()).toBe(true);
    });

    it('should accept showDataTable state', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('showDataTable', false);
      fixture.detectChanges();
      
      expect(component.showDataTable()).toBe(false);
    });

    it('should accept custom ariaLabel', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('ariaLabel', 'Custom Aria Label');
      fixture.detectChanges();
      
      expect(component.ariaLabel()).toBe('Custom Aria Label');
    });

    it('should accept custom ariaDescribedBy', () => {
      
      fixture.componentRef.setInput('categorySpending', []);
      fixture.componentRef.setInput('retry', vi.fn());
      fixture.componentRef.setInput('ariaDescribedBy', 'custom-description-id');
      fixture.detectChanges();
      
      expect(component.ariaDescribedBy()).toBe('custom-description-id');
    });
  });
});
