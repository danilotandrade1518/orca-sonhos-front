import type { ChartConfig } from './chart-config.interface';
import type { ChartType } from './chart-type.enum';

export interface ChartOptions extends ChartConfig {
  type: ChartType;
}
