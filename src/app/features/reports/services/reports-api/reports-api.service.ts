import { inject, Injectable } from '@angular/core';
import { TransactionsApiService } from '../../../transactions/services/transactions-api.service';
import type { TransactionDto } from '../../../../../dtos/transaction';
import { ReportPeriod } from '../../types/reports.types';

export interface GetTransactionsForReportParams {
  budgetId: string;
  period: ReportPeriod;
}

@Injectable({ providedIn: 'root' })
export class ReportsApiService {
  private readonly transactionsApi = inject(TransactionsApiService);

  async getTransactionsForReport(
    params: GetTransactionsForReportParams
  ): Promise<TransactionDto[]> {
    const { budgetId, period } = params;
    const { startDate, endDate } = this.calculatePeriodDates(period);

    const allTransactions: TransactionDto[] = [];
    let page = 1;
    const pageSize = 100;
    let hasNext = true;

    while (hasNext) {
      const response = await this.transactionsApi
        .list({
          budgetId,
          page,
          pageSize,
          dateFrom: startDate,
          dateTo: endDate,
        })
        .toPromise();

      if (!response?.data?.data) {
        break;
      }

      allTransactions.push(...response.data.data);
      hasNext = response.data.meta?.hasNext ?? false;
      page++;
    }

    return allTransactions;
  }

  private calculatePeriodDates(period: ReportPeriod): { startDate: string; endDate: string } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    switch (period) {
      case ReportPeriod.CURRENT_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;

      case ReportPeriod.LAST_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        break;

      case ReportPeriod.LAST_3_MONTHS:
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;

      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }
}
