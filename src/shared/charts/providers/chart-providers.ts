import { ChartAdapterService } from '../chart-adapter/chart-adapter.service';
import { ChartConfigMapper } from '../chart-adapter/chart-config-mapper.service';
import { ChartDataTransformer } from '../chart-adapter/chart-data-transformer.service';

export const CHART_PROVIDERS = [
  ChartAdapterService,
  ChartConfigMapper,
  ChartDataTransformer,
];

