import { Injectable } from '@angular/core';
import { ChartOptions as ChartJsOptions } from 'chart.js';

import type { ChartConfig } from '../interfaces/chart-config.interface';

@Injectable({
  providedIn: 'root',
})
export class ChartConfigMapper {
  mapToChartJsOptions(config: ChartConfig): ChartJsOptions {
    const options: ChartJsOptions = {
      responsive: config.responsive ?? true,
      maintainAspectRatio: config.maintainAspectRatio ?? true,
      aspectRatio: config.aspectRatio,
      plugins: {},
      scales: {},
    };

    if (config.plugins) {
      if (config.plugins.legend) {
        options.plugins = options.plugins || {};
        options.plugins.legend = {
          display: config.plugins.legend.display ?? true,
          position: config.plugins.legend.position ?? 'top',
          labels: config.plugins.legend.labels
            ? {
                usePointStyle: config.plugins.legend.labels.usePointStyle ?? false,
                padding: config.plugins.legend.labels.padding ?? 10,
                font: config.plugins.legend.labels.font
                  ? {
                      size: config.plugins.legend.labels.font.size,
                      family: config.plugins.legend.labels.font.family,
                      weight: config.plugins.legend.labels.font.weight as
                        | 'normal'
                        | 'bold'
                        | 'lighter'
                        | 'bolder'
                        | number
                        | undefined,
                    }
                  : undefined,
              }
            : undefined,
        };
      }

      if (config.plugins.tooltip) {
        options.plugins = options.plugins || {};
        options.plugins.tooltip = {
          enabled: config.plugins.tooltip.enabled ?? true,
          backgroundColor: config.plugins.tooltip.backgroundColor,
          titleColor: config.plugins.tooltip.titleColor,
          bodyColor: config.plugins.tooltip.bodyColor,
          borderColor: config.plugins.tooltip.borderColor,
          borderWidth: config.plugins.tooltip.borderWidth,
          padding: config.plugins.tooltip.padding,
          displayColors: config.plugins.tooltip.displayColors ?? true,
        };
      }

      if (config.plugins.title) {
        options.plugins = options.plugins || {};
        options.plugins.title = {
          display: config.plugins.title.display ?? false,
          text: config.plugins.title.text,
          font: config.plugins.title.font
            ? {
                size: config.plugins.title.font.size,
                family: config.plugins.title.font.family,
                weight: config.plugins.title.font.weight as
                  | 'normal'
                  | 'bold'
                  | 'lighter'
                  | 'bolder'
                  | number
                  | undefined,
              }
            : undefined,
        };
      }
    }

    if (config.scales) {
      if (config.scales.x) {
        options.scales = options.scales || {};
        options.scales['x'] = {
          display: config.scales.x.display ?? true,
          title: config.scales.x.title
            ? {
                display: config.scales.x.title.display ?? false,
                text: config.scales.x.title.text,
              }
            : undefined,
        };
      }

      if (config.scales.y) {
        options.scales = options.scales || {};
        options.scales['y'] = {
          display: config.scales.y.display ?? true,
          beginAtZero: config.scales.y.beginAtZero ?? true,
          title: config.scales.y.title
            ? {
                display: config.scales.y.title.display ?? false,
                text: config.scales.y.title.text,
              }
            : undefined,
        };
      }
    }

    if (config.animation) {
      options.animation = {
        duration: config.animation.duration ?? 1000,
        easing: (config.animation.easing ?? 'easeInOutQuart') as
          | 'linear'
          | 'easeInOutQuart'
          | 'easeInQuad'
          | 'easeOutQuad'
          | 'easeInOutQuad'
          | 'easeInCubic'
          | 'easeOutCubic'
          | 'easeInOutCubic'
          | 'easeInQuart'
          | 'easeOutQuart'
          | 'easeInQuint'
          | 'easeOutQuint'
          | 'easeInOutQuint'
          | 'easeInSine'
          | 'easeOutSine'
          | 'easeInOutSine'
          | 'easeInExpo'
          | 'easeOutExpo'
          | 'easeInOutExpo'
          | 'easeInCirc'
          | 'easeOutCirc'
          | 'easeInOutCirc'
          | 'easeInElastic'
          | 'easeOutElastic'
          | 'easeInOutElastic'
          | 'easeInBack'
          | 'easeOutBack'
          | 'easeInOutBack'
          | 'easeInBounce'
          | 'easeOutBounce'
          | 'easeInOutBounce'
          | undefined,
      };
    }

    return options;
  }
}

