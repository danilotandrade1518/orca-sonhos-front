import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { ChartConfigMapper } from './chart-config-mapper.service';
import type { ChartConfig } from '../interfaces/chart-config.interface';

describe('ChartConfigMapper', () => {
  let mapper: ChartConfigMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartConfigMapper, provideZonelessChangeDetection()],
    });

    mapper = TestBed.inject(ChartConfigMapper);
  });

  describe('mapToChartJsOptions', () => {
    it('should map basic config to Chart.js options', () => {
      
      const config: ChartConfig = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
      };
      
      const result = mapper.mapToChartJsOptions(config);
      
      expect(result.responsive).toBe(true);
      expect(result.maintainAspectRatio).toBe(true);
      expect(result.aspectRatio).toBe(2);
    });

    it('should use default values when not provided', () => {
      
      const config: ChartConfig = {};
      
      const result = mapper.mapToChartJsOptions(config);
      
      expect(result.responsive).toBe(true);
      expect(result.maintainAspectRatio).toBe(true);
    });

    describe('legend configuration', () => {
      it('should map legend config', () => {
        
        const config: ChartConfig = {
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 15,
                font: {
                  size: 14,
                  family: 'Arial',
                  weight: 'bold',
                },
              },
            },
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.plugins?.legend).toBeDefined();
        expect(result.plugins?.legend?.display).toBe(true);
        expect(result.plugins?.legend?.position).toBe('bottom');
        expect(result.plugins?.legend?.labels?.usePointStyle).toBe(true);
        expect(result.plugins?.legend?.labels?.padding).toBe(15);
        const font = result.plugins?.legend?.labels?.font as { size?: number; family?: string; weight?: string | number };
        expect(font?.size).toBe(14);
        expect(font?.family).toBe('Arial');
        expect(font?.weight).toBe('bold');
      });

      it('should use default legend values', () => {
        
        const config: ChartConfig = {
          plugins: {
            legend: {
              display: true,
            },
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.plugins?.legend?.position).toBe('top');
        expect(result.plugins?.legend?.labels?.usePointStyle).toBe(false);
        expect(result.plugins?.legend?.labels?.padding).toBe(10);
      });
    });

    describe('tooltip configuration', () => {
      it('should map tooltip config', () => {
        
        const config: ChartConfig = {
          plugins: {
            tooltip: {
              enabled: true,
              backgroundColor: '#000000',
              titleColor: '#FFFFFF',
              bodyColor: '#CCCCCC',
              borderColor: '#FF0000',
              borderWidth: 2,
              padding: 10,
              displayColors: false,
            },
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.plugins?.tooltip).toBeDefined();
        expect(result.plugins?.tooltip?.enabled).toBe(true);
        expect(result.plugins?.tooltip?.backgroundColor).toBe('#000000');
        expect(result.plugins?.tooltip?.titleColor).toBe('#FFFFFF');
        expect(result.plugins?.tooltip?.bodyColor).toBe('#CCCCCC');
        expect(result.plugins?.tooltip?.borderColor).toBe('#FF0000');
        expect(result.plugins?.tooltip?.borderWidth).toBe(2);
        expect(result.plugins?.tooltip?.padding).toBe(10);
        expect(result.plugins?.tooltip?.displayColors).toBe(false);
      });

      it('should use default tooltip values', () => {
        
        const config: ChartConfig = {
          plugins: {
            tooltip: {
              enabled: true,
            },
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.plugins?.tooltip?.displayColors).toBe(true);
      });
    });

    describe('title configuration', () => {
      it('should map title config', () => {
        
        const config: ChartConfig = {
          plugins: {
            title: {
              display: true,
              text: 'Chart Title',
              font: {
                size: 16,
                family: 'Arial',
                weight: 'bold',
              },
            },
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.plugins?.title).toBeDefined();
        expect(result.plugins?.title?.display).toBe(true);
        expect(result.plugins?.title?.text).toBe('Chart Title');
        const titleFont = result.plugins?.title?.font as { size?: number; family?: string; weight?: string | number };
        expect(titleFont?.size).toBe(16);
        expect(titleFont?.family).toBe('Arial');
        expect(titleFont?.weight).toBe('bold');
      });
    });

    describe('scales configuration', () => {
      it('should map x scale config', () => {
        
        const config: ChartConfig = {
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'X Axis',
              },
            },
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.scales?.['x']).toBeDefined();
        expect(result.scales?.['x']?.display).toBe(true);
        const xScale = result.scales?.['x'] as { display?: boolean; title?: { display?: boolean; text?: string } };
        expect(xScale?.title?.display).toBe(true);
        expect(xScale?.title?.text).toBe('X Axis');
      });

      it('should map y scale config', () => {
        
        const config: ChartConfig = {
          scales: {
            y: {
              display: true,
              beginAtZero: false,
              title: {
                display: true,
                text: 'Y Axis',
              },
            },
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.scales?.['y']).toBeDefined();
        expect(result.scales?.['y']?.display).toBe(true);
        const yScale = result.scales?.['y'] as { display?: boolean; beginAtZero?: boolean; title?: { display?: boolean; text?: string } };
        expect(yScale?.beginAtZero).toBe(false);
        expect(yScale?.title?.display).toBe(true);
        expect(yScale?.title?.text).toBe('Y Axis');
      });

      it('should use default scale values', () => {
        
        const config: ChartConfig = {
          scales: {
            x: {
              display: true,
            },
            y: {
              display: true,
            },
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.scales?.['x']?.display).toBe(true);
        expect(result.scales?.['y']?.display).toBe(true);
        const yScaleDefault = result.scales?.['y'] as { beginAtZero?: boolean };
        expect(yScaleDefault?.beginAtZero).toBe(true);
      });
    });

    describe('animation configuration', () => {
      it('should map animation config', () => {
        
        const config: ChartConfig = {
          animation: {
            duration: 2000,
            easing: 'easeInOutQuad',
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        expect(result.animation).toBeDefined();
        const animation = result.animation as { duration?: number; easing?: string } | false;
        expect(animation && typeof animation !== 'boolean' ? animation.duration : undefined).toBe(2000);
        expect(animation && typeof animation !== 'boolean' ? animation.easing : undefined).toBe('easeInOutQuad');
      });

      it('should use default animation values', () => {
        
        const config: ChartConfig = {
          animation: {
            duration: 1000,
          },
        };
        
        const result = mapper.mapToChartJsOptions(config);
        
        const animation = result.animation as { duration?: number; easing?: string } | false;
        expect(animation && typeof animation !== 'boolean' ? animation.duration : undefined).toBe(1000);
        expect(animation && typeof animation !== 'boolean' ? animation.easing : undefined).toBe('easeInOutQuart');
      });
    });
  });
});
