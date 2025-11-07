export type ReportPeriod = 'CURRENT_MONTH' | 'LAST_MONTH' | 'LAST_3_MONTHS';

export interface ReportRequestDto {
  period: ReportPeriod;
  budgetId?: string;
  startDate?: string;
  endDate?: string;
}

