import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReportsApiService } from './reports-api.service';
import { TransactionsApiService } from '../../../transactions/services/transactions-api.service';
import { ReportPeriod } from '../../types/reports.types';
import type { TransactionDto } from '../../../../../dtos/transaction';
import type { ListTransactionsResponseDto } from '../../../../../dtos/transaction';

describe('ReportsApiService', () => {
  let service: ReportsApiService;
  let transactionsApi: {
    list: ReturnType<typeof vi.fn>;
  };

  const createMockTransaction = (
    id: string,
    amount: number,
    type: 'INCOME' | 'EXPENSE'
  ): TransactionDto => ({
    id,
    accountId: 'acc-1',
    budgetId: 'budget-1',
    amount,
    description: `Transaction ${id}`,
    type,
    date: '2024-01-15T10:00:00.000Z',
  });

  const createMockResponse = (
    transactions: TransactionDto[],
    hasNext = false
  ): ListTransactionsResponseDto => ({
    data: transactions.map((t) => ({
      id: t.id,
      description: t.description,
      amount: t.amount,
      type: t.type,
      accountId: t.accountId,
      categoryId: t.categoryId,
      budgetId: t.budgetId,
      transactionDate: t.date,
    })),
    meta: {
      hasNext,
      page: 1,
      pageSize: 100,
    },
  });

  beforeEach(() => {
    transactionsApi = {
      list: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ReportsApiService,
        { provide: TransactionsApiService, useValue: transactionsApi },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(ReportsApiService);
  });

  describe('getTransactionsForReport', () => {
    it('should fetch all transactions for current month', async () => {
      const transactions = [
        createMockTransaction('txn-1', 100.0, 'EXPENSE'),
        createMockTransaction('txn-2', 200.0, 'EXPENSE'),
      ];
      transactionsApi.list.mockReturnValue(of({ data: createMockResponse(transactions, false) }));

      const result = await service.getTransactionsForReport({
        budgetId: 'budget-1',
        period: ReportPeriod.CURRENT_MONTH,
      });

      expect(result).toHaveLength(2);
      expect(transactionsApi.list).toHaveBeenCalledTimes(1);
      expect(transactionsApi.list).toHaveBeenCalledWith(
        expect.objectContaining({
          budgetId: 'budget-1',
          page: 1,
          pageSize: 100,
        })
      );
    });

    it('should handle pagination and fetch all pages', async () => {
      const page1Transactions = Array.from({ length: 100 }, (_, i) =>
        createMockTransaction(`txn-${i + 1}`, 100.0, 'EXPENSE')
      );
      const page2Transactions = [
        createMockTransaction('txn-101', 200.0, 'EXPENSE'),
        createMockTransaction('txn-102', 300.0, 'EXPENSE'),
      ];

      transactionsApi.list
        .mockReturnValueOnce(of({ data: createMockResponse(page1Transactions, true) }))
        .mockReturnValueOnce(of({ data: createMockResponse(page2Transactions, false) }));

      const result = await service.getTransactionsForReport({
        budgetId: 'budget-1',
        period: ReportPeriod.CURRENT_MONTH,
      });

      expect(result).toHaveLength(102);
      expect(transactionsApi.list).toHaveBeenCalledTimes(2);
      expect(transactionsApi.list).toHaveBeenNthCalledWith(1, expect.objectContaining({ page: 1 }));
      expect(transactionsApi.list).toHaveBeenNthCalledWith(2, expect.objectContaining({ page: 2 }));
    });

    it('should calculate correct dates for CURRENT_MONTH', async () => {
      const now = new Date();
      const expectedStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const expectedEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        .toISOString()
        .split('T')[0];

      transactionsApi.list.mockReturnValue(of({ data: createMockResponse([], false) }));

      await service.getTransactionsForReport({
        budgetId: 'budget-1',
        period: ReportPeriod.CURRENT_MONTH,
      });

      expect(transactionsApi.list).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: expectedStartDate,
          dateTo: expectedEndDate,
        })
      );
    });

    it('should calculate correct dates for LAST_MONTH', async () => {
      const now = new Date();
      const expectedStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split('T')[0];
      const expectedEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
        .toISOString()
        .split('T')[0];

      transactionsApi.list.mockReturnValue(of(createMockResponse([], false)));

      await service.getTransactionsForReport({
        budgetId: 'budget-1',
        period: ReportPeriod.LAST_MONTH,
      });

      expect(transactionsApi.list).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: expectedStartDate,
          dateTo: expectedEndDate,
        })
      );
    });

    it('should calculate correct dates for LAST_3_MONTHS', async () => {
      const now = new Date();
      const expectedStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        .toISOString()
        .split('T')[0];
      const expectedEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        .toISOString()
        .split('T')[0];

      transactionsApi.list.mockReturnValue(of(createMockResponse([], false)));

      await service.getTransactionsForReport({
        budgetId: 'budget-1',
        period: ReportPeriod.LAST_3_MONTHS,
      });

      expect(transactionsApi.list).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: expectedStartDate,
          dateTo: expectedEndDate,
        })
      );
    });

    it('should return empty array when response has no data', async () => {
      transactionsApi.list.mockReturnValue(
        of({ data: { data: [], meta: { hasNext: false, page: 1, pageSize: 100 } } })
      );

      const result = await service.getTransactionsForReport({
        budgetId: 'budget-1',
        period: ReportPeriod.CURRENT_MONTH,
      });

      expect(result).toEqual([]);
    });

    it('should handle response without data property', async () => {
      transactionsApi.list.mockReturnValue(
        of({
          data: { data: undefined, meta: { hasNext: false, page: 1, pageSize: 100 } },
        } as unknown)
      );

      const result = await service.getTransactionsForReport({
        budgetId: 'budget-1',
        period: ReportPeriod.CURRENT_MONTH,
      });

      expect(result).toEqual([]);
    });
  });
});
