export interface ChartLegendConfig {
  display?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  labels?: {
    usePointStyle?: boolean;
    padding?: number;
    font?: {
      size?: number;
      family?: string;
      weight?: string;
    };
  };
}

export interface ChartTooltipConfig {
  enabled?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  bodyColor?: string;
  borderColor?: string;
  borderWidth?: number;
  padding?: number;
  displayColors?: boolean;
}

export interface ChartConfig {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  plugins?: {
    legend?: ChartLegendConfig;
    tooltip?: ChartTooltipConfig;
    title?: {
      display?: boolean;
      text?: string;
      font?: {
        size?: number;
        family?: string;
        weight?: string;
      };
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
      beginAtZero?: boolean;
    };
  };
  animation?: {
    duration?: number;
    easing?: string;
  };
}

