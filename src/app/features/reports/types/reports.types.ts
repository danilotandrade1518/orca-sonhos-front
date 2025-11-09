export enum ReportPeriod {
  CURRENT_MONTH = 'CURRENT_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  LAST_3_MONTHS = 'LAST_3_MONTHS',
}

export interface ReportFilters {
  period: ReportPeriod;
  budgetId?: string;
}
